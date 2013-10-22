// Copyright 2012 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// Flags: --harmony-packages

// Test basic package syntax, with and without automatic semicolon insertion.

package A {}

package A1 = A
package A2 = A;
package A3 = A2

package B {
  export vx
  export vy, lz, c, f

  var vx
  var vx, vy;
  var vx = 0, vy
  let lx, ly
  let lz = 1
  const c = 9
  function f() {}

  package C0 {}

  export package C {
    let x
    export package D { export let x }
    let y
  }

  let zz = ""

  export var x0
  export var x1, x2 = 6, x3
  export let y0
  export let y1 = 0, y2
  export const z0 = 0
  export const z1 = 2, z2 = 3
  export function f0() {}
  export package M1 {}
  export package M2 = C.D
  export package M3 at "http://where"

  import i0 from I
  import i1, i2, i3, M from I
  //import i4, i5 from "http://where"
}

package I {
  export let i0, i1, i2, i3;
  export package M {}
}

package C1 = B.C;
package D1 = B.C.D
package D2 = C1.D
package D3 = D2

package E1 at "http://where"
package E2 at "http://where";
package E3 = E1

// Check that ASI does not interfere.

package X
{
let x
}

package Y
=
X

package Z
at
"file://local"

import
vx
,
vy
from
B


package Wrap {
export
x
,
y

var
x
,
y

export
var
v1 = 1

export
let
v2 = 2

export
const
v3 = 3

export
function
f
(
)
{
}

export
package V
{
}
}

export A, A1, A2, A3, B, I, C1, D1, D2, D3, E1, E2, E3, X, Y, Z, Wrap, x, y, UU



// Check that 'package' still works as an identifier.

var package
package = {}
package["a"] = 6
function package() {}
function f(package) { return package }
try {} catch (package) {}

package
v = 20



// Check that package declarations are rejected in eval or local scope.

package M { export let x; }

assertThrows("export x;", SyntaxError);  // It's using eval, so should throw.
assertThrows("export let x;", SyntaxError);
assertThrows("import x from M;", SyntaxError);
assertThrows("package M {};", SyntaxError);

assertThrows("{ export x; }", SyntaxError);
assertThrows("{ export let x; }", SyntaxError);
assertThrows("{ import x from M; }", SyntaxError);
assertThrows("{ package M {}; }", SyntaxError);

assertThrows("function f() { export x; }", SyntaxError);
assertThrows("function f() { export let x; }", SyntaxError);
assertThrows("function f() { import x from M; }", SyntaxError);
assertThrows("function f() { package M {}; }", SyntaxError);

assertThrows("function f() { { export x; } }", SyntaxError);
assertThrows("function f() { { export let x; } }", SyntaxError);
assertThrows("function f() { { import x from M; } }", SyntaxError);
assertThrows("function f() { { package M {}; } }", SyntaxError);
