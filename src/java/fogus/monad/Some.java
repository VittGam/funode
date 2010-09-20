package fogus.monad;

import java.util.Iterator;
import java.util.ArrayList;

/**
 * User: fogusm
 * Date: Sep 2, 2009
 * Time: 10:55:10 AM
 */
public class Some<T> extends Option<T>
{
    final private T value;

    public Some(T value) {
        this.value = value;
    }

    public T value() {
        return this.value;
    }

    @SuppressWarnings("serial")
    public Iterator<T> iterator() {
        return new ArrayList<T>() {{
            add(value);
        }}.iterator();
    }
}
