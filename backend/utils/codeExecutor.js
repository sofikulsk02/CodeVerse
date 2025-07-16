const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const executeCode = async (code, language, testCases) => {
  const executionId = Date.now() + Math.random().toString(36).substr(2, 9);
  const tempDir = path.join(__dirname, '../temp');
  
  try {
    await fs.mkdir(tempDir, { recursive: true });

    let fileName, executeCommand;
    const filePath = path.join(tempDir, `${executionId}`);

    switch (language) {
      case 'javascript':
        fileName = `${filePath}.js`;
        executeCommand = `node ${fileName}`;
        break;
      case 'python':
        fileName = `${filePath}.py`;
        executeCommand = `python ${fileName}`;
        break;
      case 'java':
        fileName = `${filePath}.java`;
  
        const classMatch = code.match(/public\s+class\s+(\w+)/);
        const className = classMatch ? classMatch[1] : 'Main';
        executeCommand = `javac ${fileName} && java -cp ${tempDir} ${className}`;
        break;
      case 'cpp':
        fileName = `${filePath}.cpp`;
        const exeFile = `${filePath}.exe`;
        executeCommand = `g++ ${fileName} -o ${exeFile} && ${exeFile}`;
        break;
      default:
        throw new Error('Unsupported language');
    }

    await fs.writeFile(fileName, code);

    const results = [];
    let allPassed = true;

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const startTime = Date.now();

      try {
        const output = await executeWithInput(executeCommand, testCase.input);
        const executionTime = Date.now() - startTime;

        const normalizedOutput = output.trim();
        const expectedOutput = testCase.expected_output.trim();

        const passed = normalizedOutput === expectedOutput;
        if (!passed) allPassed = false;

        results.push({
          testCase: i + 1,
          passed,
          input: testCase.input,
          expectedOutput,
          actualOutput: normalizedOutput,
          executionTime
        });
      } catch (error) {
        allPassed = false;
        results.push({
          testCase: i + 1,
          passed: false,
          error: error.message,
          executionTime: Date.now() - startTime
        });
      }
    }

    await cleanup(filePath, language);

    return {
      status: allPassed ? 'accepted' : 'wrong_answer',
      results,
      executionTime: Math.max(...results.map(r => r.executionTime || 0)),
      memoryUsed: 0 
    };

  } catch (error) {
    await cleanup(filePath, language);
    throw new Error(`Execution error: ${error.message}`);
  }
};

const executeWithInput = (command, input) => {
  return new Promise((resolve, reject) => {
    const process = exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve(stdout);
      }
    });

    if (input) {
      process.stdin.write(input);
      process.stdin.end();
    }
  });
};

const cleanup = async (filePath, language) => {
  try {
    const extensions = {
      javascript: ['.js'],
      python: ['.py'],
      java: ['.java', '.class'],
      cpp: ['.cpp', '.exe', '.out']
    };

    const exts = extensions[language] || [];
    for (const ext of exts) {
      try {
        await fs.unlink(filePath + ext);
      } catch (e) {
        // file might not exist, ignore
      }
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};

module.exports = { executeCode };