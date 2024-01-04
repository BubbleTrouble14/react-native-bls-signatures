#pragma once

#include "bls.hpp"
#include <jsi/jsi.h>
using namespace bls;

using namespace facebook;

class JSI_EXPORT G1ElementHostObject : public jsi::HostObject
{
public:
    // Default Constructor
    G1ElementHostObject();

    // Parameterized Constructor
    G1ElementHostObject(const G1Element& otherG1Element);

    // Copy Constructor
    G1ElementHostObject(const G1ElementHostObject& other);

    // Assignment Operator
    G1ElementHostObject& operator=(const G1ElementHostObject& other);

    // Destructor
    ~G1ElementHostObject();

    jsi::Value get(jsi::Runtime&, const jsi::PropNameID& name) override;
    std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override;

    const G1Element& getG1Element() const;

private:
    G1Element* g1Element = nullptr;
};
