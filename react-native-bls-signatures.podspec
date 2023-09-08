require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-bls-signatures"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/BubbleTrouble14/react-native-bls-signatures.git", :tag => "#{s.version}" }

  s.header_mappings_dir = "cpp"

  s.pod_target_xcconfig = {
    :USE_HEADERMAP => "No"
  }

  s.ios.vendored_frameworks = "ios/Frameworks/Blst.xcframework"
  s.ios.vendored_frameworks = "ios/Frameworks/Sodium.xcframework"

  s.source_files = "ios/**/*.{h,m,mm}", "cpp/**/*.{h,cpp}"

  s.dependency "React-Core"
  s.dependency "React"
end
