import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  verify = ({ type, params }: { type: string; params: any }) => {
    if (type === 'pipelineTool') {
      return this.fetchPipelineData(params);
    } else if (type === 'board') {
      return this.verifyJiraBoard(params);
    } else if (type === 'sourceControl') {
      return this.fetchCodeBaseRepos(params);
    }
  };

  verifyJiraBoard({
    type,
    site,
    email,
    token,
    projectKey,
    startTime,
    endTime,
    boardId,
  }: {
    type: string;
    site: string;
    email: string;
    token: string;
    projectKey: string;
    startTime: string;
    endTime: string;
    boardId: string;
  }) {
    const msg = `${email}:${token}`;
    const newToken = `Basic ${btoa(msg)}`;
    return this.httpClient.get(`${this.baseUrl}/kanban/verify`, {
      params: { token: newToken, type: type.toLowerCase(), site, projectKey, startTime, endTime, boardId },
    });
  }

  fetchPipelineData({
    type,
    token,
    startTime,
    endTime,
  }: {
    type: string;
    token: string;
    startTime: string;
    endTime: string;
  }) {
    return this.httpClient.post(`${this.baseUrl}/pipeline/fetch`, { token, type, startTime, endTime });
  }

  fetchCodeBaseRepos({ type, token }: { type: string; token: string }) {
    return this.httpClient.get(`${this.baseUrl}/codebase/fetch/repos`, { params: { token, type } });
  }

  fetchPipelineInfo() {
    return this.httpClient.get('../../../assets/metrics.json');
  }

  generateReporter(params: any) {
    return this.httpClient.post(`${this.baseUrl}/generateReporter`, params);
  }

  fetchExportData(type: string, csvTimeStamp?: number) {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.get(`${this.baseUrl}/exportCsv?dataType=${type}&csvTimeStamp=${csvTimeStamp}`, {
      headers,
      responseType: 'text',
    });
  }

  fetchStepsByPipeline(params: any) {
    return this.httpClient.post(`${this.baseUrl}/pipeline/getSteps`, params);
  }
}
