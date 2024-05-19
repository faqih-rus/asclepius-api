# Asclepius API

Asclepius API is a project designed to provide a backend service for medical-related applications. This README will guide you through the setup process, including connecting to a virtual machine (VM) using WSL (Windows Subsystem for Linux) or Compute Engine, as well as detailing the Google Cloud products utilized in this project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Connecting to Your VM](#connecting-to-your-vm)
- [Google Cloud Products](#google-cloud-products)
- [Running the API](#running-the-api)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before setting up the Asclepius API, ensure you have the following installed:

- Git
- Nodejs 20 higher/i recommend you to use NVM. 
- Google Cloud SDK
- WSL (if you're on Windows)

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/faqih-rus/asclepius-api.git
   cd asclepius-api
   ```

2. **Create and activate a virtual environment:**

   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**

   ```sh
   npm install @hapi/hapi @tensorflow/tfjs-node@3.21.1 @google-cloud/firestore dotenv
   ```

## Connecting to Your VM

To connect to your VM, follow these steps:

1. **Create SSH keys:**

   ```sh
   mkdir ~/.ssh
   ssh-keygen -t rsa -f ~/.ssh/<KEY_FILENAME> -C <USERNAME> -b 2048
   cat ~/.ssh/<KEY_FILENAME>.pub
   ```

2. **Connect to the VM:**

   ```sh
   ssh -i ~/.ssh/<PRIVATE_KEY_FILENAME> <Username>@<external_IP_VM>
   ```

3. **Optional VM setup for ease of use:**

   ```sh
   htop
   cd ~/.ssh
   touch config
   nano config
   ```

   Add the following configuration:

   ```sh
   Host <Alias>
       HostName <IP_Address>
       User <VM_Username>
       IdentityFile <Path to Private SSH Key>
   ```

## Google Cloud Products

The Asclepius API utilizes several Google Cloud products:

- **Compute Engine**: Hosts the backend service.
- **Cloud Storage**: Stores machine learning models.
- **Firestore**: Stores prediction results.
- **App Engine**: Deploys the frontend application.

## Running the API

After connecting to your VM and setting up your environment, follow these steps to run the API:

1. **Navigate to the project directory:**

   ```sh
   cd asclepius-api
   ```

2. **Run the API:**

   ```sh
   npm run start
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Follow these instructions to set up and run the Asclepius API. If you encounter any issues or have questions, please refer to the project repository's issue tracker.
