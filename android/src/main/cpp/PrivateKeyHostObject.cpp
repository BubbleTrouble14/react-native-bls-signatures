#include "PrivateKeyHostObject.h"
#include "G1ElementHostObject.h"
#include "G2ElementHostObject.h"
#include <android/log.h>
#include <string>
#include <vector>
#include "TypedArray.h"

// Default Constructor
PrivateKeyHostObject::PrivateKeyHostObject() {
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
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("getG2")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toHex")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("fromBytes")));
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

  if (propName == "getG2") {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
        [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
               size_t count) -> jsi::Value {

          if (this->privateKey != nullptr) {

            auto g2ElementObj = std::make_shared<G2ElementHostObject>(privateKey->GetG2Element());
            return jsi::Object::createFromHostObject(runtime, g2ElementObj);
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


  if (propName == "fromBytes") {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
        [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
               size_t count) -> jsi::Value {

          if (count != 1) {
              throw jsi::JSError(runtime, "keyGen(..) expects one argument (object)!");
          }

          auto object = arguments[0].asObject(runtime);
          if (!isTypedArray(runtime, object)) {
              throw jsi::JSError(runtime, "keyGen argument is an object, but not of type Uint8Array!");
          }

          auto typedArray = getTypedArray(runtime, object);

          if (typedArray.size(runtime) != PrivateKey::PRIVATE_KEY_SIZE) {
              throw std::invalid_argument("PrivateKey::FromBytes: Invalid size");
          }


          PrivateKey sk = PrivateKey::FromByteVector(typedArray.toVector(runtime));

          auto childPrivateKeyObj = std::make_shared<PrivateKeyHostObject>(sk);
          return jsi::Object::createFromHostObject(runtime, childPrivateKeyObj);
        });
  }


  return jsi::Value::undefined();
}
