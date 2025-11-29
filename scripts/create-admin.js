const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter admin email (default: admin@movielist.com): ', (email) => {
  rl.question('Enter admin password: ', (password) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        rl.close();
        return;
      }
      
      const finalEmail = email || 'admin@movielist.com';
      console.log('\n=== Admin User SQL ===');
      console.log(`\nINSERT INTO users (email, name, password, role, provider) VALUES ('${finalEmail}', 'Admin User', '${hash}', 'admin', 'credentials');\n`);
      console.log('Or to update existing admin:');
      console.log(`\nUPDATE users SET password = '${hash}' WHERE email = '${finalEmail}' AND role = 'admin';\n`);
      
      rl.close();
    });
  });
});

