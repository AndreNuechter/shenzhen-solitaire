export default (async () => {
    if (!('wakeLock' in navigator && 'request' in navigator.wakeLock)) return;

    const getWakeLock = () => navigator.wakeLock.request('screen');
    await getWakeLock();

    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
            await getWakeLock();
        }
    });
})();