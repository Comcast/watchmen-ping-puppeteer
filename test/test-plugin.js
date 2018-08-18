const expect = require('expect');
const PuppeteerPingService = require('../index.js');
const mocksPath = './test/mocks'

describe('The Puppeteer Ping Service', () => {
  let service;
  let pingService;

  let errorMessage = 'puppeteer - Plugin configuration is missing or incorrect';

  beforeEach(done => {
    pingService = new PuppeteerPingService();
    service = {
      pingServiceOptions: {
        'puppeteer': {
          scriptPath : {
            value: `${mocksPath}/puppeteer-success.js`
          },
        },
      },
    };
    done();
  });

  it('should expose configuration options when queried', () => {
    var options = pingService.getDefaultOptions();
    expect(options).toHaveProperty('scriptPath');
    expect(options.scriptPath.required).toBe(true);
  });

  it('should require a configuration to be present', (done) => {
    delete service.pingServiceOptions;
      pingService.ping(service, (err) => {
        expect(err).toEqual(errorMessage);
        done();
    });
  });

  it('should require the scriptPath to be valid', (done) => {
    service.pingServiceOptions['puppeteer'].scriptPath.value = './fake_file.js';
    pingService.ping(service, (err) => {
      expect(err).toEqual(errorMessage);
      done();
    });
  });

  describe('with script execute success', () => {
    it('should exit without errors', (done) => {
      pingService = new PuppeteerPingService();
      pingService.ping(service, () => {
        done();
      });
    });
  });

  describe('with script execute failure', () => {
    beforeEach(done => {
      service.pingServiceOptions['puppeteer'].scriptPath.value = `${mocksPath}/puppeteer-fail.js`;
      done();
    });

    it('should invoke the error callback to deal with unhandled errors', (done) => {
      pingService.ping(service, (err) => {
        expect(err).toEqual('Error: I am an Error');
        done();
      });
    });

    it('should invoke the error callback to deal with emitted errors', (done) => {
      service.pingServiceOptions['puppeteer'].scriptPath.value = `${mocksPath}/puppeteer-fail-complex.js`;
      pingService.ping(service, (err) => {
        expect(err).toEqual('Error: Mock emitted error 0');
      });
      done();
    });

    it('should summarize the error returned from puppeteer', (done) => {
      pingService.ping(service, (err, body, response, time) => {
        expect(time).not.toBe(0);
        expect(err).toEqual('Error: I am an Error');
        done();
      });
    });
  });
});
