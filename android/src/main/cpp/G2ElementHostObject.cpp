#include "G2ElementHostObject.h"
#include "PrivateKeyHostObject.h"
#include <android/log.h>
#include <string>
#include <vector>
#include "TypedArray.h"

// Default Constructor
G2ElementHostObject::G2ElementHostObject() {
  g2Element = new G2Element();
  if (g2Element == nullptr) {
    throw std::runtime_error("Memory allocation failed");
  }
}

// Overloaded Constructor
G2ElementHostObject::G2ElementHostObject(const G2Element& otherG1Element) {
  g2Element = new G2Element(otherG1Element);
  if (g2Element == nullptr) {
    throw std::runtime_error("Memory allocation failed");
  }
}

// Destructor
G2ElementHostObject::~G2ElementHostObject() {
  delete g2Element;
}

const G2Element& G2ElementHostObject::getG2Element() const {
    return *g2Element;
}

std::vector<jsi::PropNameID> G2ElementHostObject::getPropertyNames(jsi::Runtime& rt) {
  std::vector<jsi::PropNameID> result;
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toBytes")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toHex")));
  return result;
}

jsi::Value G2ElementHostObject::get(jsi::Runtime& runtime, const jsi::PropNameID& propNameId) {
  auto propName = propNameId.utf8(runtime);
  auto funcName = "G2Element." + propName;

  if (propName == "toBytes") {
  return jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
      [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
              size_t count) -> jsi::Value {

        if (this->g2Element != nullptr) {
            auto newTypedArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, G2Element::SIZE);
            auto newBuffer = newTypedArray.getBuffer(runtime);

            std::memcpy(newBuffer.data(runtime), g2Element->Serialize().data(), G2Element::SIZE);

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

        if (this->g2Element != nullptr) {
          return jsi::String::createFromUtf8(runtime, Util::HexStr(g2Element->Serialize()));
        }

        return jsi::Value::undefined();

      });
  }

  return jsi::Value::undefined();
}
