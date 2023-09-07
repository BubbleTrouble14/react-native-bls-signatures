project(ReactNativeBLSSignatures)
cmake_minimum_required(VERSION 3.9.0)

set(PACKAGE_NAME "react-native-bls-signatures")
set(BUILD_DIR ${CMAKE_SOURCE_DIR}/build)
set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 17)

include(FetchContent)

# if (DEFINED ENV{BLST_MAIN})
#   set(BLST_GIT_TAG "origin/master")
# else ()
#   # This is currently anchored to upstream 3dd0f804b1819e5d03fb22ca2e6fac105932043a dated 2023-08-09 v0.3.11
#   set(BLST_GIT_TAG "3dd0f804b1819e5d03fb22ca2e6fac105932043a")
# endif ()
# set(BLST_REPOSITORY "https://github.com/supranational/blst.git")

# message(STATUS "blst will be built from: ${BLST_GIT_TAG} and repository ${BLST_REPOSITORY}")

# FetchContent_Declare(
#   blst
#   GIT_REPOSITORY ${BLST_REPOSITORY}
#   GIT_TAG ${BLST_GIT_TAG}
# )
# FetchContent_MakeAvailable(blst)

# target_include_directories(
#     reactnativebls
#     ${blst_SOURCE_DIR}
# )

# FetchContent_Declare(Sodium
#   GIT_REPOSITORY https://github.com/AmineKhaldi/libsodium-cmake.git

#   # Latest commit at the moment this was added here
#   # Anchored to libsodium v1.0.18
#   GIT_TAG f73a3fe1afdc4e37ac5fe0ddd401bf521f6bba65
# )
# set(SODIUM_PCH "on" CACHE STRING "")
# set(SODIUM_DISABLE_TESTS "on" CACHE STRING "")
# set(SODIUM_CHIA_MINIMAL "on" CACHE STRING "")
# FetchContent_MakeAvailable(Sodium)

include_directories(
        ../cpp
        ../cpp/include
        # ../bls-signatures
        # ../blst/src
)

# add_subdirectory(../bls-signatures bls)

# add_subdirectory(../blst/src blst)

add_library(reactnativebls  # <-- Library name
        SHARED
        src/main/cpp/cpp-adapter.cpp
        src/main/cpp/PrivateKeyHostObject.cpp
        src/main/cpp/AugSchemeMPLHostObject.cpp
        src/main/cpp/G1ElementHostObject.cpp
        "../cpp/JSI Utils/TypedArray.cpp"
        ../cpp/elements.cpp
        ../cpp/bls.cpp
        ../cpp/privatekey.cpp
        ../cpp/schemes.cpp
)

# Configure C++ 17
set_target_properties(
        reactnativebls PROPERTIES
        CXX_STANDARD 17
        CXX_EXTENSIONS OFF
        POSITION_INDEPENDENT_CODE ON
)

add_library( libbbs STATIC IMPORTED )
set_target_properties(libbbs
  PROPERTIES
  IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/libs/${ANDROID_ABI}/libbbs.a )

add_library( libblst STATIC IMPORTED )
set_target_properties(libblst
    PROPERTIES
    IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/libs/${ANDROID_ABI}/libblst.a )


add_library( libsodium STATIC IMPORTED )
set_target_properties(libsodium
    PROPERTIES
    IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/libs/${ANDROID_ABI}/libsodium.a )

find_package(ReactAndroid REQUIRED CONFIG)
find_library(log-lib log)

target_link_libraries(
        reactnativebls
        ${log-lib}          # <-- Logcat logger
        ReactAndroid::jsi   # <-- JSI
        android             # <-- Android JNI core
        libbbs  # Or whatever the target for blst is named in its CMakeLists.txt
        libblst
        libsodium
        # bls
        # libblst
        # libbbs
        # ${blst_SOURCE_DIR}
)
