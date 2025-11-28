import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, githubRepo } = body;

    if (action === 'export-only') {
      // Run the export script
      const scriptPath = path.join(process.cwd(), 'scripts', 'export-clean-site.js');
      const { stdout, stderr } = await execAsync(`node "${scriptPath}"`);

      if (stderr) {
        console.warn('Export stderr:', stderr);
      }

      return NextResponse.json({
        success: true,
        message: 'Site exported successfully to exported-site/',
        output: stdout
      });
    } else if (action === 'export-and-push' && githubRepo) {
      // First export
      const exportScript = path.join(process.cwd(), 'scripts', 'export-clean-site.js');
      await execAsync(`node "${exportScript}"`);

      // Then push to GitHub
      const pushScript = path.join(process.cwd(), 'scripts', 'github-push-site.js');
      const { stdout, stderr } = await execAsync(`node "${pushScript}"`, {
        env: {
          ...process.env,
          GITHUB_REPO_URL: githubRepo
        }
      });

      if (stderr && !stderr.includes('Already up to date')) {
        console.warn('Push stderr:', stderr);
      }

      return NextResponse.json({
        success: true,
        message: 'Site exported and pushed to GitHub!',
        output: stdout
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action or missing githubRepo'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Export/Push error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed: ' + (error as Error).message
    }, { status: 500 });
  }
}
