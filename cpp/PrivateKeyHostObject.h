#pragma once

#include "include/bls/bls.hpp"
#include <jsi/jsi.h>
using namespace bls;

using namespace facebook;

class JSI_EXPORT PrivateKeyHostObject : public jsi::HostObject
{
public:
    // Default Constructor
    PrivateKeyHostObject();

    // Parameterized Constructor
    PrivateKeyHostObject(const PrivateKey& privateKey);

    // Copy Constructor
    PrivateKeyHostObject(const PrivateKeyHostObject& other);

    // Assignment Operator
    PrivateKeyHostObject& operator=(const PrivateKeyHostObject& other);

    // Destructor
    ~PrivateKeyHostObject();

    jsi::Value get(jsi::Runtime&, const jsi::PropNameID& name) override;
    std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override;

    const PrivateKey& getPrivateKey() const;

private:
    PrivateKey* privateKey = nullptr;
};
