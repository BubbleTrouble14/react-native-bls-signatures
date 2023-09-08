#pragma once

#import <jsi/jsi.h>
#import "include/bls/bls.hpp"
#import <Foundation/Foundation.h>

using namespace bls;
using namespace facebook;

class JSI_EXPORT AugSchemeMPLHostObject : public jsi::HostObject {
public:
  // Constructor
  AugSchemeMPLHostObject();

  // Destructor
  ~AugSchemeMPLHostObject();

  jsi::Value get(jsi::Runtime&, const jsi::PropNameID& name) override;
  std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override;

};
