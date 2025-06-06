import { GoogleAuth } from "google-auth-library";
import { App, Release } from "./types";

export class FirebaseApiService {
  constructor(private auth: GoogleAuth) {}

  async listApps(projectId: string): Promise<App[]> {
    const client = await this.auth.getClient();
    const accessToken = (await client.getAccessToken()).token;

    const url = `https://firebaseappdistribution.googleapis.com/v1/projects/${projectId}/apps`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to list apps: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return result.apps || [];
  }

  async listReleases(projectId: string, appId: string): Promise<Release[]> {
    const client = await this.auth.getClient();
    const accessToken = (await client.getAccessToken()).token;

    let allReleases: Release[] = [];
    let nextPageToken: string | undefined = undefined;

    do {
      let url = `https://firebaseappdistribution.googleapis.com/v1/projects/${projectId}/apps/${appId}/releases`;
      if (nextPageToken) {
        url += `?pageToken=${nextPageToken}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to list releases for app ${appId}: ${response.status} ${errorText}`
        );
      }
      const result = await response.json();
      allReleases = allReleases.concat(result.releases || []);
      nextPageToken = result.nextPageToken;
    } while (nextPageToken);

    return allReleases;
  }

  async deleteReleases(
    projectId: string,
    appId: string,
    releaseNames: string[]
  ): Promise<void> {
    if (releaseNames.length === 0) {
      console.log("No releases provided to delete.");
      return;
    }

    const client = await this.auth.getClient();
    const accessToken = (await client.getAccessToken()).token;

    const url = `https://firebaseappdistribution.googleapis.com/v1/projects/${projectId}/apps/${appId}/releases:batchDelete`;
    const chunkSize = 100;
    
    for (let i = 0; i < releaseNames.length; i += chunkSize) {
      const chunk = releaseNames.slice(i, i + chunkSize);
      const formattedReleaseNames = chunk;

      console.log(
        `Attempting to delete a chunk of ${formattedReleaseNames.length} release(s) for app ${appId}.`
      );

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ names: formattedReleaseNames }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to batch delete a chunk of releases for app ${appId}: ${
            response.status
          } ${errorText}. Releases in this chunk: ${formattedReleaseNames.join(
            ", "
          )}`
        );
      } else {
        console.log(
          `Successfully deleted a chunk of ${formattedReleaseNames.length} release(s) for app ${appId}.`
        );
      }
    }
    console.log(
      `Finished attempting to delete ${releaseNames.length} release(s) in chunks for app ${appId}.`
    );
  }
}
