project(ReactNativeBLSSignatures)
cmake_minimum_required(VERSION 3.9.0)

set(PACKAGE_NAME "react-native-bls-signatures")
set(BUILD_DIR ${CMAKE_SOURCE_DIR}/build)
set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 17)

include_directories(
        ../cpp
)

add_library(reactnativebls  # <-- Library name
        SHARED
        src/main/cpp/cpp-adapter.cpp
        src/main/cpp/PrivateKeyHostObject.cpp
        src/main/cpp/AugSchemeMPLHostObject.cpp
        src/main/cpp/BasicSchemeMPLHostObject.cpp
        src/main/cpp/PopSchemeMPLHostObject.cpp
        src/main/cpp/G1ElementHostObject.cpp
        src/main/cpp/G2ElementHostObject.cpp
        ../cpp/TypedArray.cpp
        ../cpp/include/bls/bls.cpp
        ../cpp/include/bls/elements.cpp
        ../cpp/include/bls/privatekey.cpp
        ../cpp/include/bls/schemes.cpp
)

# Configure C++ 17
set_target_properties(
        reactnativebls PROPERTIES
        CXX_STANDARD 17
        CXX_EXTENSIONS OFF
        POSITION_INDEPENDENT_CODE ON
)

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
        libblst
        libsodium
)
