import * as assert from 'assert';
import { slow, suite, test, timeout } from 'mocha-typescript';

@suite(timeout(3000), slow(1000))
class Hello {
    @test public world() {
        assert(true);
    }
}
