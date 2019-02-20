export class TagService {
  async list() {
    return Promise.resolve([
      'programming',
      'javascript',
      'emberjs',
      'angularjs',
      'react',
      'mean',
      'node',
      'rails'
    ]);
  }
}
