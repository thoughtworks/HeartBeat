import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
        testToken: 'testToken',
        startTime: 1689080044000,
        endTime: 1789944044000,
      };

      apiService.verify({ type, params });
      expect(httpClientSpy.post.calls.count()).toBe(1);
    });

    describe('should call verifyBoard when type is board', () => {
      const jiraCommonParams = {
        site: 'site',
        email: 'your_email@163.com',
        token: 'token',
        projectKey: 'projectKey',
        startTime: '1689080044000',
        endTime: '1789944044000',
        boardId: '2',
      };

      it('should return Jira data when type is Jira', () => {
        const type = 'board';
        const jiraBoardParam = new JiraBoardParam({
          type: 'Jira',
          ...jiraCommonParams,
        });
        apiService.verify({ type, params: jiraBoardParam });
        expect(httpClientSpy.get.calls.count()).toBe(1);
      });

      it('should return Classic Jira data when type is Classic Jira', () => {
        const type = 'board';
        const classicJiraBoardParam = new JiraBoardParam({
          type: 'Classic Jira',
          ...jiraCommonParams,
        });
        apiService.verify({ type, params: classicJiraBoardParam });
        expect(httpClientSpy.get.calls.count()).toBe(1);
      });

      it('should return Linear data when type is Linear', () => {
        const type = 'board';
        const linearJiraBoardParam = new LinearBoardParam({
          type: 'Linear',
          teamName: 'yourTeam',
          teamId: '12',
          startTime: '1689080044000',
          endTime: '1789944044000',
          token: 'token',
        });
        apiService.verify({ type, params: linearJiraBoardParam });
        expect(httpClientSpy.get.calls.count()).toBe(1);
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
    });
  });

  it('should call httpClient.get when fetchPipelineInfo is called', () => {
    apiService.fetchPipelineInfo();
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('should call httpClient.post when generateReporter is called', () => {
    apiService.generateReporter('params');
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });

  it('should call httpClient.get when fetchExportData is called', () => {
    const type = 'type';
    const csvTimeStamp = 1660201532188;
    apiService.fetchExportData(type, csvTimeStamp);
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('should call httpClient.get when fetchExportSprintData is called', () => {
    const csvTimeStamp = 1660201532188;
    apiService.fetchExportSprintData(csvTimeStamp);
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('should call httpClient.get when fetchStepsByPipeline is called', () => {
    apiService.fetchStepsByPipeline('params');
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });
});
