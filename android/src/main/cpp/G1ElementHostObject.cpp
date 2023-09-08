#include "G1ElementHostObject.h"
#include "PrivateKeyHostObject.h"
#include <android/log.h>
#include <string>
#include <vector>
#include "TypedArray.h"

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

const G1Element& G1ElementHostObject::getG1Element() const {
    return *g1Element;
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

  if (propName == "getFingerprint") {
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
      [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
              size_t count) -> jsi::Value {

        if (this->g1Element != nullptr) {

          return jsi::Value(static_cast<double>(g1Element->GetFingerprint()));

        }

        return jsi::Value::undefined();

      });
  }

  if (propName == "toBytes") {
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
      [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
              size_t count) -> jsi::Value {

        if (this->g1Element != nullptr) {
            auto newTypedArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, G1Element::SIZE);
            auto newBuffer = newTypedArray.getBuffer(runtime);

            std::memcpy(newBuffer.data(runtime), g1Element->Serialize().data(), G1Element::SIZE);

            return newTypedArray;
        }

        return jsi::Value::undefined();

      });
  }

  if (propName == "toHex") {
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
      [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
              size_t count) -> jsi::Value {

        if (this->g1Element != nullptr) {
          return jsi::String::createFromUtf8(runtime, Util::HexStr(g1Element->Serialize()));
        }

        return jsi::Value::undefined();

      });
  }

  return jsi::Value::undefined();
}
