package fogus.monad;

/**
 * User: fogusm
 * Date: Sep 2, 2009
 * Time: 10:52:44 AM
 */
public abstract class Option<T> implements Iterable<T>
{
    public abstract T value();
}

