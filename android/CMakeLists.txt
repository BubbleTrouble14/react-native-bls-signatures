cmake_minimum_required(VERSION 3.13)
project(RNBls)

set(PACKAGE_NAME "rnbls")
set(CMAKE_VERBOSE_MAKEFILE ON)
set(BUILD_DIR ${CMAKE_SOURCE_DIR}/build)
set(CMAKE_CXX_STANDARD 17)

add_compile_options(
        -fexceptions
        -frtti
        -std=c++20
        -Wall
        -Wpedantic
        -DFOLLY_NO_CONFIG=1
        -DLOG_TAG=\"ReactNative\")

find_package(ReactAndroid REQUIRED CONFIG)
find_package(fbjni REQUIRED CONFIG)
find_library(LOG_LIB log)

file(GLOB_RECURSE SOURCES_COMMON CONFIGURE_DEPENDS
    "../cpp/**.cpp"
)

add_library(
  ${PACKAGE_NAME}
  SHARED
  ${SOURCES_COMMON}
  cpp-adapter.cpp
  ../bls-signatures/src/bls.cpp
  ../bls-signatures/src/elements.cpp
  ../bls-signatures/src/privatekey.cpp
  ../bls-signatures/src/schemes.cpp
  "./build/generated/source/codegen/jni/react/renderer/components/RNBlsSpec/RNBlsSpecJSI-generated.cpp"
)

# Specifies a path to native header files.
target_include_directories(
  ${PACKAGE_NAME}
  PRIVATE
  ../bls-signatures/src
  ../cpp
  "${REACT_NATIVE_DIR}/ReactAndroid/src/main/jni/react/turbomodule"
  "${REACT_NATIVE_DIR}/ReactCommon"
  "${REACT_NATIVE_DIR}/ReactCommon/callinvoker"
  "${REACT_NATIVE_DIR}/ReactCommon/runtimeexecutor"
  "./build/generated/source/codegen/jni/react/renderer/components/RNBlsSpec"
)

# # build shared lib
# set_target_properties(${PACKAGE_NAME} PROPERTIES LINKER_LANGUAGE CXX)

# target_link_libraries(
#   ${PACKAGE_NAME}
#   log
#   android
# )

find_package(blst REQUIRED CONFIG)

target_link_libraries(
  ${PACKAGE_NAME}
  ReactAndroid::turbomodulejsijni
  ReactAndroid::jsi                      # <-- RN: JSI
  ReactAndroid::reactnativejni           # <-- RN: React Native JNI bindings
  ReactAndroid::react_nativemodule_core  # <-- RN: React Native native module core
  ${LOG_LIB}                             # <-- Logcat logger
  android                                # <-- Android JNI core
  fbjni::fbjni                    # <-- fbjni
  blst::blst
)

# option(USE_SODIUM "Use libsodium for BLSALLOC" ON)

if(SODIUM_ENABLED)
  add_definitions(-DBLSALLOC_SODIUM)
  find_package(sodium REQUIRED CONFIG)
  target_link_libraries(
    ${PACKAGE_NAME}
    sodium::sodium
  )
endif()
