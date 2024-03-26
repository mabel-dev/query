def find_path(path):
    """
    Where files are is different depending on the environment, if we're in a
    container search in the /app/src folder, this is pretty quick to search
    from here. Otherwise do a broader search which is a little slower.
    """
    import glob

    paths = glob.glob(f"/app/src/**/{path}", recursive=True)
    if len(paths) == 0:
        paths = glob.glob(f"**/{path}", recursive=True)
    for i in paths:
        if i.endswith(path):
            return i
