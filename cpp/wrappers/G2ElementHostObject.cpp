#include "G2ElementHostObject.h"
#include "PrivateKeyHostObject.h"
#include "TypedArray.h"
#include <string>
#include <vector>

// Default Constructor
G2ElementHostObject::G2ElementHostObject()
{
    g2Element = new G2Element();
    if (g2Element == nullptr) {
        throw std::runtime_error("G2Element Memory allocation failed");
    }
}

// Parameterized Constructor
G2ElementHostObject::G2ElementHostObject(const G2Element& otherG2Element)
{
    g2Element = new G2Element(otherG2Element);
    if (g2Element == nullptr) {
        throw std::runtime_error("G2Element Memory allocation failed");
    }
}

// Copy Constructor
G2ElementHostObject::G2ElementHostObject(const G2ElementHostObject& other)
{
    g2Element = new G2Element(*other.g2Element);
}

// Assignment Operator
G2ElementHostObject& G2ElementHostObject::operator=(const G2ElementHostObject& other)
{
    if (this != &other) // Check for self-assignment
    {
        delete g2Element;
        g2Element = new G2Element(*other.g2Element);
    }
    return *this;
}

// Destructor
G2ElementHostObject::~G2ElementHostObject() { delete g2Element; }

const G2Element& G2ElementHostObject::getG2Element() const { return *g2Element; }

std::vector<jsi::PropNameID> G2ElementHostObject::getPropertyNames(jsi::Runtime& rt)
{
    std::vector<jsi::PropNameID> result;
    result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toBytes")));
    result.push_back(jsi::PropNameID::forUtf8(rt, std::string("toHex")));
    result.push_back(jsi::PropNameID::forUtf8(rt, std::string("fromBytes")));
    result.push_back(jsi::PropNameID::forUtf8(rt, std::string("fromHex")));
    result.push_back(jsi::PropNameID::forUtf8(rt, std::string("add")));
    result.push_back(jsi::PropNameID::forUtf8(rt, std::string("negate")));
    result.push_back(jsi::PropNameID::forUtf8(rt, std::string("equalTo")));
    return result;
}

jsi::Value G2ElementHostObject::get(jsi::Runtime& runtime, const jsi::PropNameID& propNameId)
{
    auto propName = propNameId.utf8(runtime);
    auto funcName = "G2Element." + propName;

    if (propName == "toBytes") {
        return jsi::Function::createFromHostFunction(runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
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
        return jsi::Function::createFromHostFunction(runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
            [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
                size_t count) -> jsi::Value {
                if (this->g2Element != nullptr) {
                    return jsi::String::createFromUtf8(runtime, Util::HexStr(g2Element->Serialize()));
                }

                return jsi::Value::undefined();
            });
    }

    if (propName == "fromBytes") {
        return jsi::Function::createFromHostFunction(runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
            [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
                size_t count) -> jsi::Value {
                if (count != 1) {
                    throw jsi::JSError(runtime, "fromBytes(..) expects one argument (object)!");
                }

                auto object = arguments[0].asObject(runtime);
                if (!isTypedArray(runtime, object)) {
                    throw jsi::JSError(runtime, "fromBytes argument is an object, but not of type Uint8Array!");
                }

                auto typedArray = getTypedArray(runtime, object);

                if (typedArray.size(runtime) != G2Element::SIZE) {
                    throw std::invalid_argument("G2Element::FromBytes: Invalid size");
                }

                G2Element g2 = G2Element::FromByteVector(typedArray.toVector(runtime));

                auto g2Obj = std::make_shared<G2ElementHostObject>(g2);
                return jsi::Object::createFromHostObject(runtime, g2Obj);
            });
    }

    if (propName == "fromHex") {
        return jsi::Function::createFromHostFunction(runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
            [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
                size_t count) -> jsi::Value {
                if (count != 1) {
                    throw jsi::JSError(runtime, "fromHex(..) expects one argument (hexString)!");
                }

                if (!arguments[0].isString()) {
                    throw jsi::JSError(runtime, "fromHex argument is not a string");
                }

                auto hex = arguments[0].asString(runtime);

                G2Element g2 = G2Element::FromBytes(Util::HexToBytes(hex.utf8(runtime)));

                auto g2Obj = std::make_shared<G2ElementHostObject>(g2);
                return jsi::Object::createFromHostObject(runtime, g2Obj);
            });
    }

    if (propName == "add") {
        return jsi::Function::createFromHostFunction(runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
            [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
                size_t count) -> jsi::Value {
                if (count != 1) {
                    throw jsi::JSError(runtime, "add(..) expects one argument (otherG2Element)!");
                }

                // otherG2Element
                auto g2ElementObject = arguments[0].asObject(runtime);
                if (!g2ElementObject.isHostObject<G2ElementHostObject>(runtime)) {
                    throw jsi::JSError(runtime, "First argument is an object, but not of type G2Element!");
                }
                auto g2ElementHostObject = g2ElementObject.getHostObject<G2ElementHostObject>(runtime);
                G2Element otherG2Element = g2ElementHostObject->getG2Element();

                if (this->g2Element != nullptr) {
                    G2Element result = *this->g2Element + otherG2Element;
                    auto resultObj = std::make_shared<G2ElementHostObject>(result);
                    return jsi::Object::createFromHostObject(runtime, resultObj);
                }

                return jsi::Value::undefined();
            });
    }

    if (propName == "negate") {
        return jsi::Function::createFromHostFunction(runtime, jsi::PropNameID::forAscii(runtime, funcName), 0,
            [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
                size_t count) -> jsi::Value {
                if (this->g2Element != nullptr) {
                    auto g2Obj = std::make_shared<G2ElementHostObject>(g2Element->Negate());
                    return jsi::Object::createFromHostObject(runtime, g2Obj);
                }

                return jsi::Value::undefined();
            });
    }

    if (propName == "equalTo") {
        return jsi::Function::createFromHostFunction(runtime, jsi::PropNameID::forAscii(runtime, funcName), 1,
            [this](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
                size_t count) -> jsi::Value {
                if (count != 1) {
                    throw jsi::JSError(runtime, "equalTo(..) expects one argument (otherG2Element)!");
                }

                // otherG2Element
                auto g2KeyObject = arguments[0].asObject(runtime);
                if (!g2KeyObject.isHostObject<G2ElementHostObject>(runtime)) {
                    throw jsi::JSError(runtime, "equalTo first argument is an object, but not of type G2Element!");
                }
                auto g2HostObject = g2KeyObject.getHostObject<G2ElementHostObject>(runtime);
                G2Element otherG2Element = g2HostObject->getG2Element();

                if (this->g2Element != nullptr) {
                    bool areEqual = (*this->g2Element == otherG2Element);
                    return jsi::Value(areEqual);
                }

                return jsi::Value(false);
            });
    }

    throw jsi::JSError(runtime, "Unknown property: " + propName);
}
