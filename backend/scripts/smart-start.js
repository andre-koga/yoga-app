const { exec } = require('child_process');

function runCommand(command) {
    return new Promise((resolve, reject) => {
        // Increase maxBuffer to 10MB to avoid truncation
        exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
            if (error) {
                // Pass the error object but attach stdout/stderr for inspection
                error.stdout = stdout;
                error.stderr = stderr;
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

async function startSupabase() {
    console.log('Attempting to start Supabase...');

    try {
        // First, try to stop current project just in case
        try {
            await runCommand('supabase stop --no-backup');
        } catch (e) {
            // Ignore error if not running
        }

        const output = await runCommand('supabase start');
        console.log(output);
        console.log('Supabase started successfully!');
    } catch (error) {
        const stderr = error.stderr || '';
        const stdout = error.stdout || '';
        const combinedOutput = stderr + stdout;

        console.log(combinedOutput); // Show the user what happened

        // Check for conflicting project ID
        // Pattern: "supabase stop --project-id <project-id>"
        const match = combinedOutput.match(/supabase stop --project-id ([a-zA-Z0-9-_]+)/);

        if (match && match[1]) {
            const conflictingProjectId = match[1];
            console.log(`\nDetected conflicting project: ${conflictingProjectId}`);
            console.log(`Stopping conflicting project...`);

            try {
                await runCommand(`supabase stop --project-id ${conflictingProjectId}`);
                console.log('Conflicting project stopped. Retrying start...');
                const retryOutput = await runCommand('supabase start');
                console.log(retryOutput);
                console.log('Supabase started successfully on retry!');
            } catch (retryError) {
                console.error('Failed to start Supabase even after stopping conflict:', retryError);
                process.exit(1);
            }
        } else {
            console.error('Failed to start Supabase with an unknown error.');
            process.exit(1);
        }
    }
}

startSupabase();
