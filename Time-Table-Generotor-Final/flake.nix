{
  description = "Time Table Generator";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShell = pkgs.mkShell {
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
        };

        packages = {
          default = pkgs.buildPythonPackage {
            pname = "time-table-generator";
            version = "1.0.0";

            src = ./.;

            propagatedBuildInputs = [
              pkgs.python310Packages.fastapi
              pkgs.python310Packages.uvicorn
              pkgs.python310Packages.pydantic
              pkgs.python310Packages.motor
              pkgs.python310Packages.python-dotenv
              pkgs.python310Packages.scikit-learn
              pkgs.python310Packages.aiocache
              pkgs.python310Packages.fastapi-limiter
              pkgs.python310Packages.aiomcache
              pkgs.python310Packages.hypercorn
              pkgs.python310Packages.trello
              pkgs.python310Packages.asana
              pkgs.python310Packages.prometheus_client
              pkgs.python310Packages.sentry-sdk
            ];

            meta = with pkgs.lib; {
              description = "A project to generate timetables";
              license = licenses.mit;
              maintainers = with maintainers; [ your-github-username ];
            };
          };
        };
      }
    );
}
