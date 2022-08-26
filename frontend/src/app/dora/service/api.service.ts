import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { LinearBoardParam } from '../types/LinearBoardParam';
import { JiraBoardParam } from '../types/JiraBoardParam';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  verify = ({ type, params }: { type: string; params: any }) => {
    switch (type) {
      case 'pipelineTool':
        return this.fetchPipelineData(params);
      case 'board':
        return this.verifyBoard(params);
      case 'sourceControl':
        return this.fetchCodeBaseRepos(params);
      default:
        throw Error('Invalid data source type');
    }
  };

  verifyBoard(params: JiraBoardParam | LinearBoardParam): Observable<object> {
    const fnMap = {
      Jira: this.verifyJiraBoard,
      'Classic Jira': this.verifyJiraBoard,
      Linear: this.verifyLinearBoard,
    };
    const { type } = params;
    return fnMap[type].bind(this)(params);
  }

  verifyJiraBoard({ type, site, email, token, projectKey, startTime, endTime, boardId }: JiraBoardParam) {
    const msg = `${email}:${token}`;
    const newToken = `Basic ${btoa(msg)}`;
    return this.httpClient.get(`${this.baseUrl}/kanban/verify`, {
      params: { token: newToken, type: type.toLowerCase(), site, projectKey, startTime, endTime, boardId },
    });
  }

  verifyLinearBoard({ type, teamName, teamId, startTime, endTime, token }: LinearBoardParam) {
    return this.httpClient.get(`${this.baseUrl}/kanban/verify`, {
      params: { token, type: type.toLowerCase(), teamName, teamId, startTime, endTime },
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

  fetchExportData(type: string, csvTimeStamp: number) {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.get(`${this.baseUrl}/exportCsv?dataType=${type}&csvTimeStamp=${csvTimeStamp}`, {
      headers,
      responseType: 'text',
    });
  }
  fetchExportSprintData(timeStamp: number) {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.get(`${this.baseUrl}/exportExcel?timeStamp=${timeStamp}`, {
      headers,
      responseType: 'blob',
      observe: 'body',
    });
  }
  fetchStepsByPipeline(params: any) {
    return this.httpClient.post(`${this.baseUrl}/pipeline/getSteps`, params);
  }
}
