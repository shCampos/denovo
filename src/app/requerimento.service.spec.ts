import { TestBed } from '@angular/core/testing';

import { RequerimentoService } from './requerimento.service';

describe('RequerimentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequerimentoService = TestBed.get(RequerimentoService);
    expect(service).toBeTruthy();
  });
});
