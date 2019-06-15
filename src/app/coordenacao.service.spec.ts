import { TestBed } from '@angular/core/testing';

import { CoordenacaoService } from './coordenacao.service';

describe('CoordenacaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoordenacaoService = TestBed.get(CoordenacaoService);
    expect(service).toBeTruthy();
  });
});
