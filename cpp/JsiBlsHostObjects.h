// Copied & modified
// https://github.com/Shopify/react-native-skia/blob/main/package/cpp/api/JsiSkHostObjects.h
// Credits to William and Christian

#pragma once

#include <memory>
#include <utility>

#include "JsiHostObject.h"

namespace RNBls {

namespace jsi = facebook::jsi;

#define JSI_API_TYPENAME(A)                                                                                                                \
  JSI_PROPERTY_GET(__typename__) {                                                                                                         \
    return jsi::String::createFromUtf8(runtime, #A);                                                                                       \
  }

#define EXPORT_JSI_API_TYPENAME(CLASS, TYPENAME)                                                                                           \
  JSI_API_TYPENAME(TYPENAME)                                                                                                               \
  JSI_EXPORT_PROPERTY_GETTERS(JSI_EXPORT_PROP_GET(CLASS, __typename__))

template <typename T> class JsiBlsWrappingHostObject : public RNJsi::JsiHostObject {
public:
  /**
   * Default constructor
   * @param context Platform context
   */
  JsiBlsWrappingHostObject(T object) : RNJsi::JsiHostObject(), _object(std::move(object)) {}

  /**
   * Returns the underlying object exposed by this host object. This object
   * should be wrapped in a shared pointer of some kind
   * @return Underlying object
   */
  T getObject() {
    return _object;
  }
  const T getObject() const {

    return _object;
  }

  /**
   Updates the inner object with a new version of the object.
   */
  void setObject(T object) {
    _object = object;
  }

  /**
   Dispose function that can be exposed to JS by using the JSI_API_TYPENAME
   macro
   */
  JSI_HOST_FUNCTION(dispose) {
    safeDispose();
    return jsi::Value::undefined();
  }

protected:
  /**
   Override to implement disposale of allocated resources like smart pointers
   etc. This method will only be called once for each instance of this class.
   */
  virtual void releaseResources() = 0;

private:
  void safeDispose() {
    if (!_isDisposed) {
      _isDisposed = true;
      releaseResources();
    }
  }

  /**
   * Wrapped object
   */
  T _object;

  /**
   Resource disposed flag
   */
  std::atomic<bool> _isDisposed = {false};
};

template <typename T, typename HostObjectType> class JsiBlsWrappingSharedPtrHostObject : public JsiBlsWrappingHostObject<std::shared_ptr<T>> {
public:
  JsiBlsWrappingSharedPtrHostObject(std::shared_ptr<T> object) : JsiBlsWrappingHostObject<std::shared_ptr<T>>(std::move(object)) {}

   // Converts a JSI value to a T object
    static T fromValue(jsi::Runtime& runtime, const jsi::Value& value) {
        if (!value.isObject()) {
            throw jsi::JSError(runtime, "Expected an object for conversion.");
        }
        auto object = value.asObject(runtime);
        if (!object.isHostObject<HostObjectType>(runtime)) {
            throw jsi::JSError(runtime, "Expected a host object of the correct type.");
        }
        auto hostObject = object.asHostObject<HostObjectType>(runtime);
        auto objectSharedPtr = hostObject->getObject();
        if (!objectSharedPtr) {
            throw jsi::JSError(runtime, "Object is null.");
        }
        return *objectSharedPtr;
    }

    // Converts a JSI array value to a std::vector of T objects
    static std::vector<T> arrayFromValue(jsi::Runtime& runtime, const jsi::Value& value) {
        if (!value.isObject() || !value.asObject(runtime).isArray(runtime)) {
            throw jsi::JSError(runtime, "Expected an array");
        }

        jsi::Array arr = value.asObject(runtime).asArray(runtime);
        size_t length = arr.length(runtime);

        std::vector<T> objects;
        objects.reserve(length);
        for (size_t i = 0; i < length; i++) {
            jsi::Value elementValue = arr.getValueAtIndex(runtime, i);
            objects.push_back(fromValue(runtime, elementValue));
        }

        return objects;
    }

    // Returns the jsi object from a T object
    static jsi::Value toValue(jsi::Runtime& runtime, T object) {
        auto objectSharedPtr = std::make_shared<T>(std::move(object));
        return jsi::Object::createFromHostObject(runtime, std::make_shared<HostObjectType>(objectSharedPtr));
    }

  // /**
  //   Returns the underlying object from a host object of this type
  //  */
  // static std::shared_ptr<T> fromValue(jsi::Runtime& runtime, const jsi::Value& obj) {
  //   return std::static_pointer_cast<JsiBlsWrappingSharedPtrHostObject>(obj.asObject(runtime).asHostObject(runtime))->getObject();
  // }

protected:
  void releaseResources() override {
    // Clear internally allocated objects
    this->setObject(nullptr);
  }
};

} // namespace RNBls
