# Contributing to Agent-Core FS Toolkit

Thank you for your interest in improving the Secure FS Toolkit!

## Development Workflow

1. **Branching Strategy**:
   - `main`: Production-ready code.
   - `beta`: Release candidates and stabilization.
   - `dev`: Active development and new features.
2. **Setup**:
   ```bash
   npm install
   ```
3. **Testing**:
   Always add tests for new features in the `tests/` directory and run:
   ```bash
   npm test
   ```
4. **Building**:
   Ensure the project builds without errors:
   ```bash
   npm run build
   ```

## Pull Request Process

- Submit PRs to the `dev` branch.
- Ensure all tests pass and documentation is updated.
- Maintain strict TypeScript typing (no `any`).
- Adhere to the security constraints: never bypass path validation.

## Security

If you find a security vulnerability (e.g., a path traversal escape), please report it immediately via a GitHub Issue or a security advisory.
