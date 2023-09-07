#include "PrivateKeyHostObject.h"
#include "G1ElementHostObject.h"
#include <android/log.h>
#include <string>
#include <vector>
#include "TypedArray.h"
// Default Constructor
PrivateKeyHostObject::PrivateKeyHostObject() {
  // privateKey = new PrivateKey();
  // if (privateKey == nullptr) {
  //   throw std::runtime_error("Memory allocation failed");
  // }
}

// Overloaded Constructor
PrivateKeyHostObject::PrivateKeyHostObject(const PrivateKey& otherPrivateKey) {
  privateKey = new PrivateKey(otherPrivateKey);
  if (privateKey == nullptr) {
    throw std::runtime_error("Memory allocation failed");
  }
}

// Destructor
PrivateKeyHostObject::~PrivateKeyHostObject() {
  delete privateKey;
}

const PrivateKey& PrivateKeyHostObject::getPrivateKey() const {
    return *privateKey;
}

std::vector<jsi::PropNameID> PrivateKeyHostObject::getPropertyNames(jsi::Runtime& rt) {
  std::vector<jsi::PropNameID> result;
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toBytes")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("getG1")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toHex")));
  return result;
}

jsi::Value PrivateKeyHostObject::get(jsi::Runtime& runtime, const jsi::PropNameID& propNameId) {
  auto propName = propNameId.utf8(runtime);
  auto funcName = "PrivateKey." + propName;


  if (propName == "toBytes") {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
        [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
               size_t count) -> jsi::Value {

          if (this->privateKey != nullptr) {

            auto newTypedArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, PrivateKey::PRIVATE_KEY_SIZE);
            auto newBuffer = newTypedArray.getBuffer(runtime);

            std::memcpy(newBuffer.data(runtime), privateKey->Serialize().data(), PrivateKey::PRIVATE_KEY_SIZE);

            return newTypedArray;
          }

          return jsi::Value::undefined();

        });
  }

  if (propName == "getG1") {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
        [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
               size_t count) -> jsi::Value {

          if (this->privateKey != nullptr) {

            auto g1ElementObj = std::make_shared<G1ElementHostObject>(privateKey->GetG1Element());
            return jsi::Object::createFromHostObject(runtime, g1ElementObj);
          }

          return jsi::Value::undefined();

        });
  }


  if (propName == "toHex") {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
        [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
                size_t count) -> jsi::Value {

          if (this->privateKey != nullptr) {
            return jsi::String::createFromUtf8(runtime, Util::HexStr(privateKey->Serialize()));
          }

          return jsi::Value::undefined();

        });
    }


  return jsi::Value::undefined();
}
