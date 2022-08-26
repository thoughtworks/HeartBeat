import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { JiraBoardParam } from '../types/JiraBoardParam';
import { LinearBoardParam } from '../types/LinearBoardParam';

describe('ApiService', () => {
  let apiService: ApiService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    apiService = new ApiService(httpClientSpy);
  });

  it('should be created', () => {
    expect(apiService).toBeTruthy();
  });

  describe('verify', () => {
    it('should call httpClient.post when type is pipelineTool', () => {
      const type = 'pipelineTool';
      const params = {
        type: 'buildKite',
        token: 'token',
        startTime: '1689080044000',
        endTime: '1789944044000',
      };

      apiService.verify({ type, params });

      expect(httpClientSpy.post.calls.count()).toBe(1);
      expect(httpClientSpy.post.calls.argsFor(0)).toEqual([`${apiService.baseUrl}/pipeline/fetch`, params]);
    });

    describe('should call verifyBoard when type is board', () => {
      const jiraCommonParams = {
        site: 'site',
        token: 'token',
        projectKey: 'projectKey',
        startTime: '1689080044000',
        endTime: '1789944044000',
        boardId: '2',
      };
      const expectedJiraCommonParams = {
        type: 'board',
        ...jiraCommonParams,
      };

      it('should return Jira data when type is Jira', () => {
        const type = 'board';
        const jiraBoardParam = new JiraBoardParam({
          type: 'Jira',
          email: 'your_email',
          ...jiraCommonParams,
        });

        apiService.verify({ type, params: jiraBoardParam });

        expect(httpClientSpy.get.calls.count()).toBe(1);
        expect(httpClientSpy.get.calls.argsFor(0)).toContain(
          `${apiService.baseUrl}/kanban/verify`,
          expectedJiraCommonParams
        );
      });

      it('should return Classic Jira data when type is Classic Jira', () => {
        const type = 'board';
        const classicJiraBoardParam = new JiraBoardParam({
          type: 'Classic Jira',
          email: 'your_email',
          ...jiraCommonParams,
        });

        apiService.verify({ type, params: classicJiraBoardParam });

        expect(httpClientSpy.get.calls.count()).toBe(1);
        expect(httpClientSpy.get.calls.argsFor(0)).toContain(
          `${apiService.baseUrl}/kanban/verify`,
          expectedJiraCommonParams
        );
      });

      it('should return Linear data when type is Linear', () => {
        const type = 'board';
        const linearJiraBoardCommonParam = {
          teamName: 'teamName',
          teamId: '12',
          startTime: '1689080044000',
          endTime: '1789944044000',
          token: 'token',
        };
        const linearJiraBoardParam = new LinearBoardParam({
          type: 'Linear',
          ...linearJiraBoardCommonParam,
        });

        apiService.verify({ type, params: linearJiraBoardParam });

        expect(httpClientSpy.get.calls.count()).toBe(1);
        expect(httpClientSpy.get.calls.argsFor(0)).toContain(`${apiService.baseUrl}/kanban/verify`, {
          type: 'linear',
          ...linearJiraBoardCommonParam,
        });
      });
    });

    it('should call httpClient.get when type is sourceControl', () => {
      const type = 'sourceControl';
      const params = {
        type: 'Github',
        token: 'token',
      };

      apiService.verify({ type, params });

      expect(httpClientSpy.get.calls.count()).toBe(1);
      expect(httpClientSpy.get.calls.argsFor(0)).toContain(`${apiService.baseUrl}/codebase/fetch/repos`, {
        type,
        params,
      });
    });

    it('should throw an error when data source type is invalid', () => {
      const type = 'error';
      expect(() => apiService.verify({ type, params: null })).toThrowError('Invalid data source type');
    });
  });

  it('should call httpClient.get when fetchPipelineInfo is called', () => {
    apiService.fetchPipelineInfo();
    expect(httpClientSpy.get.calls.count()).toBe(1);
    expect(httpClientSpy.get.calls.argsFor(0)).toContain('../../../assets/metrics.json');
  });

  it('should call httpClient.post when generateReporter is called', () => {
    apiService.generateReporter('params');

    expect(httpClientSpy.post.calls.count()).toBe(1);
    expect(httpClientSpy.post.calls.argsFor(0)).toEqual([`${apiService.baseUrl}/generateReporter`, 'params']);
  });

  it('should call httpClient.get when fetchExportData is called', () => {
    const type = 'board';
    const csvTimeStamp = 1660201532188;

    apiService.fetchExportData(type, csvTimeStamp);

    expect(httpClientSpy.get.calls.count()).toBe(1);
    expect(httpClientSpy.get.calls.argsFor(0)).toContain(
      `${apiService.baseUrl}/exportCsv?dataType=${type}&csvTimeStamp=${csvTimeStamp}`
    );
  });

  it('should call httpClient.get when fetchExportSprintData is called', () => {
    const csvTimeStamp = 1660201532188;

    apiService.fetchExportSprintData(csvTimeStamp);

    expect(httpClientSpy.get.calls.count()).toBe(1);
    expect(httpClientSpy.get.calls.argsFor(0)).toContain(`${apiService.baseUrl}/exportExcel?timeStamp=${csvTimeStamp}`);
  });

  it('should call httpClient.get when fetchStepsByPipeline is called', () => {
    apiService.fetchStepsByPipeline('params');

    expect(httpClientSpy.post.calls.count()).toBe(1);
    expect(httpClientSpy.post.calls.argsFor(0)).toEqual([`${apiService.baseUrl}/pipeline/getSteps`, 'params']);
  });
});
