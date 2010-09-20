package test.monad;

import fogus.monad.None;
import fogus.monad.Option;
import fogus.monad.Some;
import junit.framework.TestCase;

public class OptionTest extends TestCase
{
    public OptionTest(String name) {
        super(name);
    }

    protected void setUp() throws Exception {
        super.setUp();
    }

    protected void tearDown() throws Exception {
        super.tearDown();
    }

    public void testNone() {
        Option<String> o = new None<String>();

        assertNotNull(o);
        assertNull(o.value());

        for (String s : o) {
            assertNull(s);
        }
    }

    public void testSome() {
        Some<String> o = new Some<String>("foo");
        int sz = 0;

        assertNotNull(o);

        for (String s : o) {
            assertNotNull(s);
            assertTrue(s.equals("foo"));
            sz++;
        }

        assertTrue(sz == 1);
    }

    public void testComposibility() {
        Option<Integer> hasy = new Some<Integer>(42);
        Option<Integer> hasn = new None<Integer>();
        Option<Integer> sum  = new Some<Integer>(0);

        for (int x : hasy) {
            for (int y : hasn) {
                sum = new Some<Integer>(x + y);
            }
        }

        assertEquals(0, sum.value().intValue());
        assertNull(hasn.value());
        assertNotNull(hasy.value());

        hasn = new Some<Integer>(100);

        for (int x : hasy) {
            for (int y : hasn) {
                sum = new Some<Integer>(x + y);
            }
        }

        assertNotNull(hasn.value());
        assertEquals(142, sum.value().intValue());
    }
}
