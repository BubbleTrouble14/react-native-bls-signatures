require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'
extra_flags = ''

Pod::Spec.new do |s|
  s.name         = "react-native-bls-signatures"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => "https://github.com/BubbleTrouble14/react-native-bls-signatures.git", :tag => "#{s.version}" }

  # s.source_files = "ios/**/*.{h,m,mm}", "cpp/**/*.{hpp,cpp,c,h}"
  # "bls-signatures/src/*.{h,hpp,cpp}"

  s.source_files = [
    "ios/**/*.{h,m,mm}",
    "cpp/**/*.{h,hpp,cpp}",
    "bls-signatures/src/bls.cpp",
    "bls-signatures/src/bls.hpp",
    "bls-signatures/src/elements.cpp",
    "bls-signatures/src/elements.hpp",
    "bls-signatures/src/privatekey.cpp",
    "bls-signatures/src/privatekey.hpp",
    "bls-signatures/src/schemes.cpp",
    "bls-signatures/src/schemes.hpp",
    "bls-signatures/src/hdkeys.hpp",
    "bls-signatures/src/hkdf.hpp",
    "bls-signatures/src/util.hpp"
  ]


  s.preserve_paths = [
    "cpp/**/*.h",
    "ios/**/*.h",
    "bls-signatures/src/*.hpp"
  ]

  sodium_enabled = ENV['SODIUM_ENABLED'] != '0' ? "enabled" : "disabled"
  Pod::UI.puts("[BlsSignatures] react-native-bls-signatures has libsodium #{sodium_enabled}!")

  # Default to enabled unless explicitly set to '0'
  vendored_frameworks = ['ios/Clibblst.xcframework']
  if ENV['SODIUM_ENABLED'] != '0' then
    vendored_frameworks << 'ios/Clibsodium.xcframework'
    extra_flags = ' -DBLSALLOC_SODIUM=1'
  end
  s.vendored_frameworks = vendored_frameworks

  s.dependency "React-Core"

  # Don't install the dependencies when we run `pod install` in the old architecture.
  if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
    # s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
    s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1" + extra_flags
    s.pod_target_xcconfig = {
        "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
        "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
        "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
    }
    s.dependency "React-Codegen"
    s.dependency "RCT-Folly"
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/core"
  else
    s.pod_target_xcconfig = {
      'CLANG_CXX_LANGUAGE_STANDARD' => 'c++17',
      'DEFINES_MODULE' => 'YES',
      "HEADER_SEARCH_PATHS" => "\"${PODS_ROOT}/Headers/Public/React-hermes\" \"${PODS_ROOT}/Headers/Public/hermes-engine\"",
      "OTHER_CFLAGS" => "$(inherited)",
      "OTHER_CPLUSPLUSFLAGS" => "#{extra_flags}"
    }

    s.dependency "React-callinvoker"
    s.dependency "React"
    s.dependency "React-Core"
  end

end
