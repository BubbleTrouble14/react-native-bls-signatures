#include "G1ElementHostObject.h"
#include "PrivateKeyHostObject.h"
#include <android/log.h>
#include <string>
#include <vector>
#include "../cpp/JSI Utils/TypedArray.h"

#include "../cpp/bls.hpp"
using namespace bls;

const size_t G1ElementHostObject::G1_SIZE = 48;

// Default Constructor
G1ElementHostObject::G1ElementHostObject() {
  g1Element = new G1Element();
  if (g1Element == nullptr) {
    throw std::runtime_error("Memory allocation failed");
  }
}

// Overloaded Constructor
G1ElementHostObject::G1ElementHostObject(const G1Element& otherG1Element) {
  g1Element = new G1Element(otherG1Element);
  if (g1Element == nullptr) {
    throw std::runtime_error("Memory allocation failed");
  }
}

// Destructor
G1ElementHostObject::~G1ElementHostObject() {
  delete g1Element;
}

std::vector<jsi::PropNameID> G1ElementHostObject::getPropertyNames(jsi::Runtime& rt) {
  std::vector<jsi::PropNameID> result;
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("getFingerprint")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toBytes")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toHex")));
  return result;
}

jsi::Value G1ElementHostObject::get(jsi::Runtime& runtime, const jsi::PropNameID& propNameId) {
  auto propName = propNameId.utf8(runtime);
  auto funcName = "G1Element." + propName;

  // if (propName == "getFingerprint") {
  // return jsi::Function::createFromHostFunction(
  //     runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
  //     [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
  //             size_t count) -> jsi::Value {

  //       if (this->g1Element != nullptr) {
  //         unsigned char g1Bytes[G1_SIZE];
  //         g1Element->compress(g1Bytes);

  //         uint8_t hash[32];
  //         blst::blst_sha256(hash, g1Bytes, G1_SIZE);
  //         uint32_t fingerprint = bls::Util::FourBytesToInt(hash);

  //         return jsi::Value(static_cast<double>(fingerprint));

  //         // return jsi::Value(runtime, fingerprint);
  //       }

  //       return jsi::Value::undefined();

  //     });
  // }

  // if (propName == "toBytes") {
  // return jsi::Function::createFromHostFunction(
  //     runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
  //     [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
  //             size_t count) -> jsi::Value {

  //       if (this->g1Element != nullptr) {
  //         unsigned char g1Bytes[G1_SIZE];  // or 48 if you want to compress it
  //         g1Element->compress(g1Bytes);  // or g1Point.compress(g1Bytes) to compress

  //         // Create a new TypedArray to store the G1 point bytes
  //         auto newTypedArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, G1_SIZE);  // or 48 if compressed
  //         auto newBuffer = newTypedArray.getBuffer(runtime);

  //         std::memcpy(newBuffer.data(runtime), g1Bytes, G1_SIZE);  // or 48 if compressed

  //         return newTypedArray;
  //       }

  //       return jsi::Value::undefined();

  //     });
  // }

  // if (propName == "toHex") {
  // return jsi::Function::createFromHostFunction(
  //     runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
  //     [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
  //             size_t count) -> jsi::Value {

  //       if (this->g1Element != nullptr) {
  //         unsigned char g1Bytes[G1_SIZE];  // or 48 if you want to compress it
  //         g1Element->compress(g1Bytes);  // or g1Point.compress(g1Bytes) to compress

  //         std::string hexString = bls::Util::HexStr(g1Bytes, G1_SIZE);
  //         return jsi::String::createFromUtf8(runtime, hexString);
  //       }

  //       return jsi::Value::undefined();

  //     });
  // }

  return jsi::Value::undefined();
}
