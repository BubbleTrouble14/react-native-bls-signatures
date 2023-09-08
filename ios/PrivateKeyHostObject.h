#pragma once

#import <jsi/jsi.h>
#import "../cpp/include/bls/bls.hpp"
#import <Foundation/Foundation.h>

using namespace bls;
using namespace facebook;

class JSI_EXPORT PrivateKeyHostObject : public jsi::HostObject {
public:
  // Constructor
  PrivateKeyHostObject();

  PrivateKeyHostObject(const PrivateKey& privateKey);

  // Destructor
  ~PrivateKeyHostObject();

  jsi::Value get(jsi::Runtime&, const jsi::PropNameID& name) override;
  std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override;

  const PrivateKey& getPrivateKey() const;

private:
  PrivateKey* privateKey;
};
