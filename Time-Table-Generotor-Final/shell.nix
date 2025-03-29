{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.python310
    pkgs.python310Packages.pip
    pkgs.python310Packages.virtualenv
    pkgs.nodejs
    pkgs.docker
    pkgs.docker-compose
    pkgs.hypercorn
    pkgs.mongodb
    pkgs.rust
  ];

  shellHook = ''
    source venv/bin/activate
    export MONGODB_CONNECTION_STRING="mongodb://localhost:27017/timetable"
    export SECRET_KEY="your_secret_key"
  '';
}
