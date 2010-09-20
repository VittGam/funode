package fogus.monad;

import java.util.Iterator;
import java.util.ArrayList;

/**
 * User: fogusm
 * Date: Sep 2, 2009
 * Time: 10:54:25 AM
 */
public class None<T> extends Option<T>
{
    public Iterator<T> iterator() {
        return new ArrayList<T>().iterator();
    }

    @Override
    public T value() {
        return null;
    }
}
