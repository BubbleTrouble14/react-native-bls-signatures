#include "AugSchemeMPLHostObject.h"
#include "PrivateKeyHostObject.h"
#include <android/log.h>
#include <string>
#include <vector>
#include "../cpp/JSI Utils/TypedArray.h"

#include "../cpp/bls.hpp"
using namespace bls;

// Constructor
AugSchemeMPLHostObject::AugSchemeMPLHostObject() {
}

// Destructor
AugSchemeMPLHostObject::~AugSchemeMPLHostObject() {
}

std::vector<jsi::PropNameID> AugSchemeMPLHostObject::getPropertyNames(jsi::Runtime& rt) {
  std::vector<jsi::PropNameID> result;
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("keyGen")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("deriveChildSk")));
  return result;
}

jsi::Value AugSchemeMPLHostObject::get(jsi::Runtime& runtime, const jsi::PropNameID& propNameId) {
  auto propName = propNameId.utf8(runtime);
  auto funcName = "PrivateKey." + propName;

  if (propName == "keyGen") {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
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

          PrivateKey sk = AugSchemeMPL().KeyGen(typedArray.toVector(runtime));

          auto childPrivateKeyObj = std::make_shared<PrivateKeyHostObject>(sk);
          return jsi::Object::createFromHostObject(runtime, childPrivateKeyObj);
        });
  }

  if (propName == "deriveChildSk") {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 2, // Two arguments: privateKey and index
        [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
               size_t count) -> jsi::Value {

          if (count != 2) {
              throw jsi::JSError(runtime, "deriveChildSk(..) expects two arguments (privateKey, index)!");
          }

          // Handle the PrivateKey argument
          auto privateKeyObject = arguments[0].asObject(runtime);
          if (!privateKeyObject.isHostObject<PrivateKeyHostObject>(runtime)) {
              throw jsi::JSError(runtime, "deriveChildSk first argument is an object, but not of type PrivateKey!");
          }
          auto privateKeyHostObject = privateKeyObject.getHostObject<PrivateKeyHostObject>(runtime);
          PrivateKey privateKey = privateKeyHostObject->getPrivateKey();
          // blst::SecretKey secretKey = privateKeyHostObject->getSecretKey();

          // Handle the index argument
          if (!arguments[1].isNumber()) {
              throw jsi::JSError(runtime, "deriveChildSk second argument is not a number!");
          }
          uint32_t index = arguments[1].asNumber();


          PrivateKey childSecretKey = AugSchemeMPL().DeriveChildSk(privateKey, index);

          auto childPrivateKeyObj = std::make_shared<PrivateKeyHostObject>(childSecretKey);
          return jsi::Object::createFromHostObject(runtime, childPrivateKeyObj);
        });
  }


  return jsi::Value::undefined();
}
