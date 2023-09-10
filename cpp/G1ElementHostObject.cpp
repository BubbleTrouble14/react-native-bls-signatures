#include "G1ElementHostObject.h"
#include "PrivateKeyHostObject.h"
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
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toBytes")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toHex")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("fromBytes")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("fromHex")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("getFingerprint")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("add")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("negate")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("equalTo")));
  return result;
}

jsi::Value G1ElementHostObject::get(jsi::Runtime& runtime, const jsi::PropNameID& propNameId) {
  auto propName = propNameId.utf8(runtime);
  auto funcName = "G1Element." + propName;

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

  if (propName == "fromBytes") {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
        [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
                size_t count) -> jsi::Value {

          if (count != 1) {
              throw jsi::JSError(runtime, "fromBytes(..) expects one argument (object)!");
          }

          auto object = arguments[0].asObject(runtime);
          if (!isTypedArray(runtime, object)) {
              throw jsi::JSError(runtime, "fromBytes argument is an object, but not of type Uint8Array!");
          }

          auto typedArray = getTypedArray(runtime, object);

          if (typedArray.size(runtime) != G1Element::SIZE) {
              throw std::invalid_argument("G1Element::FromBytes: Invalid size");
          }


          G1Element g1 = G1Element::FromByteVector(typedArray.toVector(runtime));

          auto g1Obj = std::make_shared<G1ElementHostObject>(g1);
          return jsi::Object::createFromHostObject(runtime, g1Obj);
        });
  }

  if (propName == "fromHex") {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
        [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
               size_t count) -> jsi::Value {

          if (count != 1) {
              throw jsi::JSError(runtime, "fromHex(..) expects one argument (object)!");
          }


          if (!arguments[0].isString()) {
              throw jsi::JSError(runtime, "Expected the argument to be a hex string");
          }

          auto hex = arguments[0].asString(runtime);

          G1Element g1 = G1Element::FromBytes(Util::HexToBytes(hex.utf8(runtime)));

          auto g1Obj = std::make_shared<G1ElementHostObject>(g1);
          return jsi::Object::createFromHostObject(runtime, g1Obj);
        });
  }

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

  if (propName == "add") {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
        [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
               size_t count) -> jsi::Value {

          if (count != 1) {
              throw jsi::JSError(runtime, "add(..) expects one argument (object)!");
          }

          //pk
          auto g1ElementObject = arguments[0].asObject(runtime);
          if (!g1ElementObject.isHostObject<G1ElementHostObject>(runtime)) {
              throw jsi::JSError(runtime, "First argument is an object, but not of type G1Element!");
          }
          auto g1ElementHostObject = g1ElementObject.getHostObject<G1ElementHostObject>(runtime);
          G1Element pk1 = g1ElementHostObject->getG1Element();

          if (this->g1Element != nullptr) {
              G1Element pk = *this->g1Element + pk1;
              auto pkObj = std::make_shared<G1ElementHostObject>(pk);
              return jsi::Object::createFromHostObject(runtime, pkObj);
          }

          return jsi::Value::undefined();
        });
  }

  if (propName == "negate") {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
        [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
                size_t count) -> jsi::Value {

          if (this->g1Element != nullptr) {
                auto g1Obj = std::make_shared<G1ElementHostObject>(g1Element->Negate());
                return jsi::Object::createFromHostObject(runtime, g1Obj);
          }

          return jsi::Value::undefined();

        });
  }

  if (propName == "equalTo") {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
        [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
               size_t count) -> jsi::Value {

          if (count != 1) {
              throw jsi::JSError(runtime, "equalTo(..) expects one argument (object)!");
          }

          //sk
          auto g1KeyObject = arguments[0].asObject(runtime);
          if (!g1KeyObject.isHostObject<G1ElementHostObject>(runtime)) {
              throw jsi::JSError(runtime, "equalTo first argument is an object, but not of type PrivateKey!");
          }
          auto g1HostObject = g1KeyObject.getHostObject<G1ElementHostObject>(runtime);
          G1Element g1 = g1HostObject->getG1Element();

          if (this->g1Element != nullptr) {
              bool areEqual = (*g1Element == g1);
              return jsi::Value(areEqual);
          }

          return jsi::Value(false);
        });
  }

  return jsi::Value::undefined();
}
