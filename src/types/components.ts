export type PipelineTone =
  | "prospect"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won";

export type PipelineStage = {
  name: string;
  count: number;
  tone: PipelineTone;
};

export type PipelineCardProps = {
  stages: PipelineStage[];
};
