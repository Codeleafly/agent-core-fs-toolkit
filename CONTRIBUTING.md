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

## AI Agent Context

We maintain several files to provide context to AI agents (Claude, Gemini, Cursor, etc.):
- `CLAUDE.md`
- `GEMINI.md`
- `.cursorrules`
- `AGENTS.md`

If you modify core architecture or security rules, you **must** update these files to ensure AI agents stay synchronized with the project's constraints.
