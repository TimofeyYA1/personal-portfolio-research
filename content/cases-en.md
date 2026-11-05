# Timofei Iakovlev — selected case studies

[Русский](cases-ru.md) · [Content index](README.md)

**Status: research draft, 6 November 2026.** These texts are for reviewing the career narrative. Publishing this research does not update the personal website or professional profiles. Production work, working prototypes and team contributions are distinguished explicitly.

[Verification scope and open questions](../research/case-verification.md) are documented separately. Private sources, internal links and project source code are not published.

## T-Bank

Product experiments expressed as configuration

I worked on a configuration model for experiments in a cashback personalisation platform. It lets analysts describe audiences, conditions and changes to cashback rates without changing parts of the application logic in code.

- **Context:** team-based production engineering.
- **My contribution:** backend and data pipelines, experiment configuration, validation, observability and documentation for analysts.
- **Tools:** Python, Apache Airflow, Kafka and SQL; related service work with Kotlin and PostgreSQL.
- **Evidence period:** March–September 2026. This is the case-study period, not an employment start date.

### The problem

Experiment settings were closely tied to pipeline implementation. Changing audience allocation or cashback rules could require an analyst to request a code change. New conditions added branches and made it harder to explain how several rules affected the final result.

The challenge was to give analysts a useful way to describe an experiment while retaining control over which combinations of rules were valid.

### My contribution

I worked on moving scattered conditions into a declarative experiment model. Each description brings together the target audience, participation conditions and actions affecting cashback. Configuration checks identify invalid inputs, while runtime checks validate the results of execution.

I discussed launch scenarios and workflow blockers directly with analysts, then used those conversations to develop the model and its documentation. A useful configuration system has to explain what combinations mean, not simply expose more parameters.

Another part of the work involved independent experiments affecting the same customer. This requires a distinction between membership and the order in which changes are applied. I contributed to this change and to extending the approach across product areas.

I also worked on information that makes a result explainable: which experiments were applied and what changed along the way. Related platform work included Kafka-based data delivery, data contracts, PostgreSQL-backed shipping cursors and lag metrics.

### The engineering decision

Configuration became a language for bounded changes. An analyst expresses intent within a defined model; code owns its semantics, validation and execution. That boundary allows some changes to move closer to the people defining the experiment while keeping behaviour testable.

### The trade-off

Configuration does not eliminate engineering. A genuinely new action or a change to execution semantics still requires implementation, tests and documentation. An overly general builder would make analysts do more engineering; an overly narrow model would send every change back to a developer.

### The result

Some experiments and rule changes can be prepared through configuration without changing application code. The shared approach was used across three product areas. Independent experiments and more explainable processing expanded the platform’s capabilities without representing every scenario as a separate branch of business logic.

This is a qualitative result. The case does not claim a measured speedup, revenue increase or incident reduction: a comparable measurement of those outcomes has not been established.

### The demonstration

A separate teaching example uses fictional records to show a rule, an invalid configuration and an explanation of one participant’s outcome. It illustrates the engineering idea; it is not T-Bank’s interface, code or data.

### What I can discuss

Choosing the boundary between configuration and code, validating interacting rules, and making results understandable to both engineers and analysts.

## CODY

Continue work on a Mac from an iPhone

CODY is my personal AI companion prototype for iPhone. It connects a voice and mobile interface to coding and terminal sessions on a Mac, helping the user select a task, send the next action and see its result.

- **Status:** working prototype; commercial adoption has not been established.
- **My contribution:** product concept, architecture, mobile interface, Mac Bridge, shared protocol and session integration.
- **Tools:** React Native / Expo, TypeScript, Node.js, WebSocket, Zod, Skia, Reanimated and tmux.

### The problem

Directing several sessions from a phone is a context problem. “Let it continue” is meaningful only if the system knows which project and conversation the user means. Showing a terminal window is not enough: a session should persist independently of its presentation, and its status should reflect real work.

### How the prototype works

The mobile app sends typed messages to a local Mac Bridge. The Bridge validates messages, maintains project and session state, and calls the relevant adapter. Terminal work uses tmux, with a visible terminal window as a view of the session. Coding conversations use a provider integration layer.

Voice interaction and precise manual selection share the same project and conversation context. When several targets are plausible, the interface offers a choice. Buttons use short-lived action identifiers resolved and checked by the Bridge, rather than reconstructing an action from arbitrary text on the phone.

The character’s expressions communicate whether CODY is listening, processing, working or encountering a problem. A separate workspace view supports tasks that need full history or explicit conversation selection.

### The engineering decision

The Mac Bridge and actual sessions own the work state. The phone controls them through an explicit protocol. Connection authentication, runtime message validation and a checked association between an action and its target are implemented in the prototype.

### The trade-off

Conversational control is useful for a short intention, but can be ambiguous. It needs a precise counterpart: an explicit project, conversation and action. Voice interaction also has a clear boundary: the app must be open and active. This prototype does not promise continuous background listening.

### Current state

The mobile client, Mac Bridge, shared protocol, context management and session adapters are implemented. The project includes tests for the protocol, state transitions, intent handling and Bridge behaviour. These are evidence of engineering work, not proof of readiness for broad deployment.

The case does not claim a user base, sales, measured productivity gains or secure access from any network. Wider use requires separate deployment, connection and user-flow validation.

### The demonstration

One complete scenario uses a fictional project: select a session, send a short task, see it run on the Mac, and receive the result on the phone. Errors and a lost connection should be as clear as success. Until a verified run is recorded, an interactive website walkthrough is labelled as an illustration of the scenario.

### What I can discuss

Separating intent from execution, maintaining precise context across devices, and giving an interface personality without obscuring system behaviour.

## BPMN.space

From scattered material to a process map people can check

BPMN.space is a team-built hackathon prototype for process analysts. It helps turn documents and notes into an editable BPMN draft while keeping questions, assumptions and supporting source material visible.

- **Status:** team prototype.
- **My role:** member of the development team. The capabilities below are team outcomes.
- **Project tools:** Python, FastAPI, Pydantic, PostgreSQL, React, TypeScript, bpmn-js and Node.js tools for diagram validation and layout.
- **Context:** described by a participant in October 2026; the initial prototype was built with a teammate in four days, according to that participant’s account.

### The problem

A procedure rarely includes every detail needed for a process model. Responsibilities may be missing, conditions ambiguous and documents contradictory. Converting this material directly into a polished diagram can hide those gaps as unspoken assumptions.

### The team’s approach

We organised the workflow around a project containing sources, questions and diagram versions. Analysis surfaces missing information. An analyst’s answer becomes a new source; it must be related to the question and checked before the uncertainty is treated as resolved.

Generation separates interpretation from formal construction. A model proposes a structured graph in JSON. Code validates the graph, compiles BPMN XML and passes it to layout and technical checks. The analyst can then edit the diagram, with manual changes taken into account during subsequent generation.

### Why this matters

Valid XML is not the same as an accurate business process. The product therefore needs both formal checks and visible grounds for its suggestions: where a role, activity or condition came from, what the sources actually establish, and what remains an assumption. Generation has explicit limits so that unsupported semantics are not quietly replaced with a plausible-looking diagram.

### The trade-off

A constrained intermediate graph is easier to validate than arbitrary model-generated BPMN XML. The cost is a limited set of generated constructs. The editor can support more than the generator; these must remain separate product claims.

### The team result

The repository implements a typed graph and deterministic XML compilation. Project documentation describes question analysis, source checking, version history, priority for manual changes and diagram editing. The prototype provides a starting point for discussing a process and refining it with an analyst.

The case does not claim measured accuracy on real company procedures, time savings or deployment within an energy company. Generation covers a bounded subset of BPMN, and a person must check whether the result correctly describes the process.

### The demonstration

A fictional purchasing procedure says “the request is approved” without identifying who approves it. The walkthrough reveals the question, adds an analyst’s sourced answer and shows the corresponding change to the diagram. This is a teaching scenario, not a recording of production use.

### What I can discuss

Where a generative model helps and where deterministic code is needed, making assumptions visible, and preserving a user’s manual work when generating again.
