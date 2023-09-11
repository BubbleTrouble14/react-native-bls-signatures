#include "AugSchemeMPLHostObject.h"
#include "PrivateKeyHostObject.h"
#include "G1ElementHostObject.h"
#include "G2ElementHostObject.h"
#include <string>
#include <vector>
#include "TypedArray.h"

// Constructor
AugSchemeMPLHostObject::AugSchemeMPLHostObject()
{
}

// Destructor
AugSchemeMPLHostObject::~AugSchemeMPLHostObject()
{
}

std::vector<jsi::PropNameID> AugSchemeMPLHostObject::getPropertyNames(jsi::Runtime &rt)
{
  std::vector<jsi::PropNameID> result;
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("skToG1")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("keyGen")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("sign")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("signPrepend")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("verify")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("aggregate")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("aggregateVerify")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("deriveChildSk")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("deriveChildSkUnhardened")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("deriveChildPkUnhardened")));
  return result;
}

jsi::Value AugSchemeMPLHostObject::get(jsi::Runtime &runtime, const jsi::PropNameID &propNameId)
{
  auto propName = propNameId.utf8(runtime);
  auto funcName = "AugSchemeMPL." + propName;

  if (propName == "skToG1")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
        [](jsi::Runtime &runtime, const jsi::Value &Value, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (count != 1)
          {
            throw jsi::JSError(runtime, "skToG1(..) expects one argument (privateKey) of type PrivateKeyHostObject!");
          }

          // sk
          auto privateKeyObject = arguments[0].asObject(runtime);
          if (!privateKeyObject.isHostObject<PrivateKeyHostObject>(runtime))
          {
            throw jsi::JSError(runtime, "skToG1 argument is an object, but not of type PrivateKeyHostObject!");
          }
          auto privateKeyHostObject = privateKeyObject.getHostObject<PrivateKeyHostObject>(runtime);
          PrivateKey privateKey = privateKeyHostObject->getPrivateKey();

          // g1
          G1Element g1Element = AugSchemeMPL().SkToG1(privateKey);
          auto g1ElementObj = std::make_shared<G1ElementHostObject>(g1Element);
          return jsi::Object::createFromHostObject(runtime, g1ElementObj);
        });
  }

  if (propName == "keyGen")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
        [](jsi::Runtime &runtime, const jsi::Value &Value, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (count != 1)
          {
            throw jsi::JSError(runtime, "keyGen(..) expects one argument (seed) of type Uint8Array!");
          }

          auto object = arguments[0].asObject(runtime);
          if (!isTypedArray(runtime, object))
          {
            throw jsi::JSError(runtime, "keyGen argument is an object, but not of type Uint8Array!");
          }

          auto typedArray = getTypedArray(runtime, object);
          PrivateKey sk = AugSchemeMPL().KeyGen(typedArray.toVector(runtime));

          auto childPrivateKeyObj = std::make_shared<PrivateKeyHostObject>(sk);
          return jsi::Object::createFromHostObject(runtime, childPrivateKeyObj);
        });
  }

  if (propName == "sign")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 2, // Two arguments: privateKey and message
        [](jsi::Runtime &runtime, const jsi::Value &Value, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (count != 2)
          {
            throw jsi::JSError(runtime, "sign(..) expects two arguments (privateKey, message) of appropriate types!");
          }

          // pk
          auto privateKeyObject = arguments[0].asObject(runtime);
          if (!privateKeyObject.isHostObject<PrivateKeyHostObject>(runtime))
          {
            throw jsi::JSError(runtime, "sign first argument is an object, but not of type PrivateKeyHostObject!");
          }
          auto privateKeyHostObject = privateKeyObject.getHostObject<PrivateKeyHostObject>(runtime);
          PrivateKey privateKey = privateKeyHostObject->getPrivateKey();

          // msg
          auto typeArrayObject = arguments[1].asObject(runtime);
          if (!isTypedArray(runtime, typeArrayObject))
          {
            throw jsi::JSError(runtime, "sign second argument is an object, but not of type Uint8Array!");
          }
          auto messageArray = getTypedArray(runtime, typeArrayObject);
          vector<uint8_t> message = messageArray.toVector(runtime);

          // g2
          G2Element g2Element = AugSchemeMPL().Sign(privateKey, message);
          auto g2ElementObj = std::make_shared<G2ElementHostObject>(g2Element);
          return jsi::Object::createFromHostObject(runtime, g2ElementObj);
        });
  }

  if (propName == "signPrepend")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 3,
        [](jsi::Runtime &runtime, const jsi::Value &Value, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (count != 3)
          {
            throw jsi::JSError(runtime, "signPrepend(..) expects three arguments (privateKey, message, prependPk) of appropriate types!");
          }

          // sk
          auto privateKeyObject = arguments[0].asObject(runtime);
          if (!privateKeyObject.isHostObject<PrivateKeyHostObject>(runtime))
          {
            throw jsi::JSError(runtime, "signPrepend first argument is an object, but not of type PrivateKeyHostObject!");
          }
          auto privateKeyHostObject = privateKeyObject.getHostObject<PrivateKeyHostObject>(runtime);
          PrivateKey privateKey = privateKeyHostObject->getPrivateKey();

          // msg
          auto typeArrayObject = arguments[1].asObject(runtime);
          if (!isTypedArray(runtime, typeArrayObject))
          {
            throw jsi::JSError(runtime, "signPrepend second argument is an object, but not of type Uint8Array!");
          }
          auto messageArray = getTypedArray(runtime, typeArrayObject);
          vector<uint8_t> message = messageArray.toVector(runtime);

          // prependPk
          auto g1ElementObject = arguments[2].asObject(runtime);
          if (!g1ElementObject.isHostObject<G1ElementHostObject>(runtime))
          {
            throw jsi::JSError(runtime, "signPrepend third argument is an object, but not of type G1ElementHostObject!");
          }
          auto g1ElementHostObject = g1ElementObject.getHostObject<G1ElementHostObject>(runtime);
          G1Element prependPk = g1ElementHostObject->getG1Element();

          // g2
          G2Element g2Element = AugSchemeMPL().Sign(privateKey, message, prependPk);
          auto g2ElementObj = std::make_shared<G2ElementHostObject>(g2Element);
          return jsi::Object::createFromHostObject(runtime, g2ElementObj);
        });
  }

  if (propName == "verify")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 3,
        [](jsi::Runtime &runtime, const jsi::Value &Value, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (count != 3)
          {
            throw jsi::JSError(runtime, "verify(..) expects three arguments (pk, message, prependPk)!");
          }

          // pk
          auto g1ElementObject = arguments[0].asObject(runtime);
          if (!g1ElementObject.isHostObject<G1ElementHostObject>(runtime))
          {
            throw jsi::JSError(runtime, "First argument is an object, but not of type G1Element!");
          }
          auto g1ElementHostObject = g1ElementObject.getHostObject<G1ElementHostObject>(runtime);
          G1Element pk = g1ElementHostObject->getG1Element();

          // msg
          auto typeArrayObject = arguments[1].asObject(runtime);
          if (!isTypedArray(runtime, typeArrayObject))
          {
            throw jsi::JSError(runtime, "message argument is an object, but not of type Uint8Array!");
          }
          auto messageArray = getTypedArray(runtime, typeArrayObject);
          vector<uint8_t> message = messageArray.toVector(runtime);

          // prependPk
          auto g2ElementObject = arguments[2].asObject(runtime);
          if (!g2ElementObject.isHostObject<G2ElementHostObject>(runtime))
          {
            throw jsi::JSError(runtime, "Third argument is an object, but not of type G2Element!");
          }
          auto g2ElementHostObject = g2ElementObject.getHostObject<G2ElementHostObject>(runtime);
          G2Element prependPk = g2ElementHostObject->getG2Element();

          auto value = AugSchemeMPL().Verify(pk, message, prependPk);

          return jsi::Value(value);
        });
  }

  if (propName == "aggregate")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
        [](jsi::Runtime &runtime, const jsi::Value &Value, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (count != 1)
          {
            throw jsi::JSError(runtime, "aggregate(..) expects one argument (g2Elements)!");
          }

          if (!arguments[0].isObject() || !arguments[0].asObject(runtime).isArray(runtime))
          {
            throw jsi::JSError(runtime, "Expected first argument to be an array");
          }

          jsi::Array arr = arguments[0].asObject(runtime).asArray(runtime);
          size_t length = arr.length(runtime);

          std::vector<G2Element> g2Elements;
          g2Elements.reserve(length);
          for (size_t i = 0; i < length; i++)
          {
            auto g2ElementObject = arr.getValueAtIndex(runtime, i).asObject(runtime);
            if (!g2ElementObject.isHostObject<G2ElementHostObject>(runtime))
            {
              throw jsi::JSError(runtime, "Element in the array is not of type G2Element!");
            }
            auto g2ElementHostObject = g2ElementObject.getHostObject<G2ElementHostObject>(runtime);
            G2Element g2Element = g2ElementHostObject->getG2Element();
            g2Elements.push_back(g2Element);
          }

          G2Element g2Element = AugSchemeMPL().Aggregate(g2Elements);

          auto g2ElementObj = std::make_shared<G2ElementHostObject>(g2Element);
          return jsi::Object::createFromHostObject(runtime, g2ElementObj);
        });
  }

  if (propName == "aggregateVerify")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 3,
        [](jsi::Runtime &runtime, const jsi::Value &Value, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (count != 3)
          {
            throw jsi::JSError(runtime, "aggregateVerify(..) expects three arguments (pks, messages, sig)!");
          }

          // pks
          if (!arguments[0].isObject() || !arguments[0].asObject(runtime).isArray(runtime))
          {
            throw jsi::JSError(runtime, "Expected first argument to be an array");
          }
          jsi::Array pksArr = arguments[0].asObject(runtime).asArray(runtime);
          size_t pksLength = pksArr.length(runtime);
          std::vector<G1Element> g1Elements;
          for (size_t i = 0; i < pksLength; i++)
          {
            auto g1ElementObject = pksArr.getValueAtIndex(runtime, i).asObject(runtime);
            if (!g1ElementObject.isHostObject<G1ElementHostObject>(runtime))
            {
              throw jsi::JSError(runtime, "Element in the array is not of type G1Element!");
            }
            auto g1ElementHostObject = g1ElementObject.getHostObject<G1ElementHostObject>(runtime);
            G1Element g1Element = g1ElementHostObject->getG1Element();
            g1Elements.push_back(g1Element);
          }

          // messages
          if (!arguments[1].isObject() || !arguments[1].asObject(runtime).isArray(runtime))
          {
            throw jsi::JSError(runtime, "Expected second argument to be an array");
          }
          jsi::Array messagesArr = arguments[1].asObject(runtime).asArray(runtime);
          size_t messagesLength = messagesArr.length(runtime);
          std::vector<vector<uint8_t>> messages;
          for (size_t i = 0; i < messagesLength; i++)
          {
            auto typeArrayObject = messagesArr.getValueAtIndex(runtime, i).asObject(runtime);
            if (!isTypedArray(runtime, typeArrayObject))
            {
              throw jsi::JSError(runtime, "message argument is an object, but not of type Uint8Array!");
            }
            auto messageArray = getTypedArray(runtime, typeArrayObject);
            vector<uint8_t> message = messageArray.toVector(runtime);
            messages.push_back(message);
          }

          // sig
          auto g2ElementObject = arguments[2].asObject(runtime);
          if (!g2ElementObject.isHostObject<G2ElementHostObject>(runtime))
          {
            throw jsi::JSError(runtime, "Third argument is an object, but not of type G2Element!");
          }
          auto g2ElementHostObject = g2ElementObject.getHostObject<G2ElementHostObject>(runtime);
          G2Element sig = g2ElementHostObject->getG2Element();

          auto value = AugSchemeMPL().AggregateVerify(g1Elements, messages, sig);

          return jsi::Value(value);
        });
  }

  if (propName == "deriveChildSk")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 2,
        [](jsi::Runtime &runtime, const jsi::Value &Value, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (count != 2)
          {
            throw jsi::JSError(runtime, "deriveChildSk(..) expects two arguments (privateKey, index)!");
          }

          // Handle the PrivateKey argument
          auto privateKeyObject = arguments[0].asObject(runtime);
          if (!privateKeyObject.isHostObject<PrivateKeyHostObject>(runtime))
          {
            throw jsi::JSError(runtime, "deriveChildSk first argument is an object, but not of type PrivateKey!");
          }
          auto privateKeyHostObject = privateKeyObject.getHostObject<PrivateKeyHostObject>(runtime);
          PrivateKey privateKey = privateKeyHostObject->getPrivateKey();

          // Handle the index argument
          if (!arguments[1].isNumber())
          {
            throw jsi::JSError(runtime, "deriveChildSk second argument is not a number!");
          }
          uint32_t index = arguments[1].asNumber();

          PrivateKey childSecretKey = AugSchemeMPL().DeriveChildSk(privateKey, index);

          auto childPrivateKeyObj = std::make_shared<PrivateKeyHostObject>(childSecretKey);
          return jsi::Object::createFromHostObject(runtime, childPrivateKeyObj);
        });
  }

  if (propName == "deriveChildSkUnhardened")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 2,
        [](jsi::Runtime &runtime, const jsi::Value &Value, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (count != 2)
          {
            throw jsi::JSError(runtime, "deriveChildSkUnhardened(..) expects two arguments (privateKey, index)!");
          }

          // Handle the PrivateKey argument
          auto privateKeyObject = arguments[0].asObject(runtime);
          if (!privateKeyObject.isHostObject<PrivateKeyHostObject>(runtime))
          {
            throw jsi::JSError(runtime, "deriveChildSkUnhardened first argument is an object, but not of type PrivateKey!");
          }
          auto privateKeyHostObject = privateKeyObject.getHostObject<PrivateKeyHostObject>(runtime);
          PrivateKey privateKey = privateKeyHostObject->getPrivateKey();

          // Handle the index argument
          if (!arguments[1].isNumber())
          {
            throw jsi::JSError(runtime, "deriveChildSkUnhardened second argument is not a number!");
          }
          uint32_t index = arguments[1].asNumber();

          PrivateKey childSecretKey = AugSchemeMPL().DeriveChildSkUnhardened(privateKey, index);

          auto childPrivateKeyObj = std::make_shared<PrivateKeyHostObject>(childSecretKey);
          return jsi::Object::createFromHostObject(runtime, childPrivateKeyObj);
        });
  }

  if (propName == "deriveChildPkUnhardened")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 2,
        [](jsi::Runtime &runtime, const jsi::Value &Value, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (count != 2)
          {
            throw jsi::JSError(runtime, "deriveChildPkUnhardened(..) expects two arguments (privateKey, index)!");
          }

          // Handle the PrivateKey argument
          auto g1ElementObject = arguments[0].asObject(runtime);
          if (!g1ElementObject.isHostObject<G1ElementHostObject>(runtime))
          {
            throw jsi::JSError(runtime, "deriveChildPkUnhardened first argument is an object, but not of type PrivateKey!");
          }
          auto g1ElementHostObject = g1ElementObject.getHostObject<G1ElementHostObject>(runtime);
          G1Element g1Element = g1ElementHostObject->getG1Element();

          // Handle the index argument
          if (!arguments[1].isNumber())
          {
            throw jsi::JSError(runtime, "deriveChildPkUnhardened second argument is not a number!");
          }
          uint32_t index = arguments[1].asNumber();

          G1Element dG1Element = AugSchemeMPL().DeriveChildPkUnhardened(g1Element, index);

          auto dG1ElementObject = std::make_shared<G1ElementHostObject>(dG1Element);
          return jsi::Object::createFromHostObject(runtime, dG1ElementObject);
        });
  }

  throw jsi::JSError(runtime, "Unknown property: " + propName);
}
