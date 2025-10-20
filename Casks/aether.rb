cask "aether" do
  version :latest
  sha256 :no_check

  url "https://github.com/siddhantj12/aether-g4/releases/latest/download/Aether.app.zip"
  name "Aether"
  desc "Matte-dark Pomodoro timer for macOS (Tauri + Next.js)"
  homepage "https://github.com/siddhantj12/aether-g4"

  app "Aether.app"

  caveats <<~EOS
    This app is not notarized. To bypass Gatekeeper on first launch, Homebrew
    can install with --no-quarantine, e.g.:
      brew install --cask --no-quarantine aether
    Or, after installing, run once:
      xattr -dr com.apple.quarantine "/Applications/Aether.app"
  EOS
end


