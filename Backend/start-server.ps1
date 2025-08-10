# PowerShell script to start the PayWallet backend server
Set-Location "D:\Stellar\hahahaah\Paywallet-stellar\Backend"

# Set environment variables
$env:MONGODB_URI = "mongodb+srv://yashdharme:yash@cluster0.blgov.mongodb.net/paywallet"
$env:JWT_SECRET = "your-super-secret-jwt-key-change-in-production"
$env:PORT = "3001"
$env:NODE_ENV = "development"

# Start the server
Write-Host "Starting PayWallet Backend Server..."
Write-Host "MongoDB URI: $env:MONGODB_URI"
Write-Host "Port: $env:PORT"

node dist/index.js
