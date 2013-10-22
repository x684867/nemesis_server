#include <node.h>
#include <v8.h>

using namespace v8;

Handle<Value> Method(const Arguments& args) {
  HandleScope scope;
  return scope.Close(String::New("world"));
}

void init(Handle<Object> exports, Handle<Object> package) {
  NODE_SET_METHOD(package, "exports", Method);
}

NODE_package(binding, init);
