#pragma once

#include "bls.hpp"
#include <jsi/jsi.h>

using namespace bls;
using namespace facebook;

class JSI_EXPORT G2ElementHostObject : public jsi::HostObject
{
public:
    // Default Constructor
    G2ElementHostObject();

    // Parameterized Constructor
    G2ElementHostObject(const G2Element& otherG2Element);

    // Copy Constructor
    G2ElementHostObject(const G2ElementHostObject& other);

    // Assignment Operator
    G2ElementHostObject& operator=(const G2ElementHostObject& other);

    // Destructor
    ~G2ElementHostObject();

    jsi::Value get(jsi::Runtime&, const jsi::PropNameID& name) override;
    std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override;

    const G2Element& getG2Element() const;

private:
    G2Element* g2Element = nullptr;
};
