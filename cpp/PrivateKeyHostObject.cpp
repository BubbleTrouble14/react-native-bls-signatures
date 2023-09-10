#include "PrivateKeyHostObject.h"
#include "G1ElementHostObject.h"
#include "G2ElementHostObject.h"
#include <string>
#include <vector>
#include "TypedArray.h"

// Default Constructor
PrivateKeyHostObject::PrivateKeyHostObject() : privateKey(nullptr)
{
}

// Parameterized Constructor
PrivateKeyHostObject::PrivateKeyHostObject(const PrivateKey &otherPrivateKey)
{
  privateKey = new PrivateKey(otherPrivateKey);
  if (privateKey == nullptr)
  {
    throw std::runtime_error("PrivateKey Memory allocation failed");
  }
}

// Copy Constructor
PrivateKeyHostObject::PrivateKeyHostObject(const PrivateKeyHostObject &other)
{
  privateKey = new PrivateKey(*other.privateKey);
}

// Assignment Operator
PrivateKeyHostObject &PrivateKeyHostObject::operator=(const PrivateKeyHostObject &other)
{
  if (this != &other) // Check for self-assignment
  {
    delete privateKey;
    privateKey = new PrivateKey(*other.privateKey);
  }
  return *this;
}

// Destructor
PrivateKeyHostObject::~PrivateKeyHostObject()
{
  if (privateKey)
  {
    delete privateKey;
    privateKey = nullptr;
  }
}

const PrivateKey &PrivateKeyHostObject::getPrivateKey() const
{
  return *privateKey;
}

std::vector<jsi::PropNameID> PrivateKeyHostObject::getPropertyNames(jsi::Runtime &rt)
{
  std::vector<jsi::PropNameID> result;
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toBytes")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toHex")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toString")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("getG1")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("getG2")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("fromBytes")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("fromHex")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("aggregate")));
  result.push_back(jsi::PropNameID::forUtf8(rt, std::string("equalTo")));
  return result;
}

jsi::Value PrivateKeyHostObject::get(jsi::Runtime &runtime, const jsi::PropNameID &propNameId)
{
  auto propName = propNameId.utf8(runtime);
  auto funcName = "PrivateKey." + propName;

  if (propName == "toBytes")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
        [this](jsi::Runtime &runtime, const jsi::Value &thisValue, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (this->privateKey != nullptr)
          {
            auto newTypedArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, PrivateKey::PRIVATE_KEY_SIZE);
            auto newBuffer = newTypedArray.getBuffer(runtime);

            std::memcpy(newBuffer.data(runtime), privateKey->Serialize().data(), PrivateKey::PRIVATE_KEY_SIZE);

            return newTypedArray;
          }

          throw jsi::JSError(runtime, "Private key is null.");
        });
  }

  if (propName == "toHex")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
        [this](jsi::Runtime &runtime, const jsi::Value &thisValue, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (this->privateKey != nullptr)
          {
            return jsi::String::createFromUtf8(runtime, Util::HexStr(privateKey->Serialize()));
          }

          throw jsi::JSError(runtime, "Private key is null.");
        });
  }

  if (propName == "toString")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
        [this](jsi::Runtime &runtime, const jsi::Value &thisValue, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (this->privateKey != nullptr)
          {
            std::string hexRepresentation = Util::HexStr(privateKey->Serialize());
            std::string finalString = "PrivateKey(0x" + hexRepresentation + ")";
            return jsi::String::createFromUtf8(runtime, finalString);
          }

          throw jsi::JSError(runtime, "Private key is null.");
        });
  }

  if (propName == "getG1")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
        [this](jsi::Runtime &runtime, const jsi::Value &thisValue, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (this->privateKey != nullptr)
          {
            auto g1ElementObj = std::make_shared<G1ElementHostObject>(privateKey->GetG1Element());
            return jsi::Object::createFromHostObject(runtime, g1ElementObj);
          }

          throw jsi::JSError(runtime, "Private key is null.");
        });
  }

  if (propName == "getG2")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
        [this](jsi::Runtime &runtime, const jsi::Value &thisValue, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (this->privateKey != nullptr)
          {
            auto g2ElementObj = std::make_shared<G2ElementHostObject>(privateKey->GetG2Element());
            return jsi::Object::createFromHostObject(runtime, g2ElementObj);
          }

          throw jsi::JSError(runtime, "Private key is null.");
        });
  }

  if (propName == "fromBytes")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 2,
        [this](jsi::Runtime &runtime, const jsi::Value &thisValue, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (count != 2)
          {
            throw jsi::JSError(runtime, "The 'fromBytes' function expects exactly two arguments.");
          }

          auto object = arguments[0].asObject(runtime);
          if (!isTypedArray(runtime, object))
          {
            throw jsi::JSError(runtime, "The 'fromBytes' argument must be an object, but it is not of type Uint8Array.");
          }

          auto typedArray = getTypedArray(runtime, object);

          if (typedArray.size(runtime) != PrivateKey::PRIVATE_KEY_SIZE)
          {
            throw jsi::JSError(runtime, "Invalid size for 'fromBytes' argument. Expected " + std::to_string(PrivateKey::PRIVATE_KEY_SIZE) + " bytes.");
          }

          if (!arguments[1].isBool())
          {
            throw jsi::JSError(runtime, "The second argument of 'fromBytes' must be of type boolean.");
          }
          auto modOrder = arguments[1].asBool();

          PrivateKey sk = PrivateKey::FromByteVector(typedArray.toVector(runtime), modOrder);

          auto childPrivateKeyObj = std::make_shared<PrivateKeyHostObject>(sk);
          return jsi::Object::createFromHostObject(runtime, childPrivateKeyObj);
        });
  }

  if (propName == "fromHex")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
        [this](jsi::Runtime &runtime, const jsi::Value &thisValue, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (count != 1)
          {
            throw jsi::JSError(runtime, "The 'fromHex' function expects exactly one argument.");
          }

          if (!arguments[0].isString())
          {
            throw jsi::JSError(runtime, "The argument of 'fromHex' must be a hex string.");
          }

          auto hex = arguments[0].asString(runtime);

          PrivateKey sk = PrivateKey::FromBytes(Util::HexToBytes(hex.utf8(runtime)));

          auto childPrivateKeyObj = std::make_shared<PrivateKeyHostObject>(sk);
          return jsi::Object::createFromHostObject(runtime, childPrivateKeyObj);
        });
  }

  if (propName == "aggregate")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
        [this](jsi::Runtime &runtime, const jsi::Value &thisValue, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (count != 1)
          {
            throw jsi::JSError(runtime, "The 'aggregate' function expects exactly one argument.");
          }

          // Ensure the argument is an array
          if (!arguments[0].isObject() || !arguments[0].asObject(runtime).isArray(runtime))
          {
            throw jsi::JSError(runtime, "The first argument of 'aggregate' must be an array.");
          }

          jsi::Array arr = arguments[0].asObject(runtime).asArray(runtime);
          size_t length = arr.length(runtime);

          std::vector<PrivateKey> privateKeys;
          privateKeys.reserve(length); // Reserve space for `length` number of elements
          for (size_t i = 0; i < length; i++)
          {
            auto privateKeyObject = arr.getValueAtIndex(runtime, i).asObject(runtime);
            if (!privateKeyObject.isHostObject<PrivateKeyHostObject>(runtime))
            {
              throw jsi::JSError(runtime, "Element in the array is not of type PrivateKeyHostObject.");
            }
            auto privateKeyHostObject = privateKeyObject.getHostObject<PrivateKeyHostObject>(runtime);
            PrivateKey privateKey = privateKeyHostObject->getPrivateKey();
            privateKeys.push_back(privateKey);
          }

          PrivateKey sk = PrivateKey::Aggregate(privateKeys);
          auto childPrivateKeyObj = std::make_shared<PrivateKeyHostObject>(sk);
          return jsi::Object::createFromHostObject(runtime, childPrivateKeyObj);
        });
  }

  if (propName == "equalTo")
  {
    return jsi::Function::createFromHostFunction(
        runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
        [this](jsi::Runtime &runtime, const jsi::Value &thisValue, const jsi::Value *arguments,
               size_t count) -> jsi::Value
        {
          if (count != 1)
          {
            throw jsi::JSError(runtime, "The 'equalTo' function expects exactly one argument.");
          }

          // Ensure the argument is a PrivateKeyHostObject
          auto privateKeyObject = arguments[0].asObject(runtime);
          if (!privateKeyObject.isHostObject<PrivateKeyHostObject>(runtime))
          {
            throw jsi::JSError(runtime, "The argument of 'equalTo' must be a PrivateKeyHostObject.");
          }
          auto privateKeyHostObject = privateKeyObject.getHostObject<PrivateKeyHostObject>(runtime);
          PrivateKey privateKey1 = privateKeyHostObject->getPrivateKey();

          if (this->privateKey != nullptr)
          {
            bool areEqual = (*privateKey == privateKey1);
            return jsi::Value(areEqual);
          }

          throw jsi::JSError(runtime, "Private key is null.");
        });
  }

  throw jsi::JSError(runtime, "Unknown property: " + propName);
}
