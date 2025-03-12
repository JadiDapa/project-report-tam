import { AccountType } from "./account";
import { ReportType } from "./report";

export interface ReportDiscussionType extends CreateReportDiscussionType {
  id: number;
  Report: ReportType;
  Account: AccountType;
  mainContent?: ReportDiscussionType;
  Replies: ReportDiscussionType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReportDiscussionType {
  content: string;
  accountId: number;
  reportId: number;
  mainContentId?: number;
}

export const discussionDummyData: ReportDiscussionType[] = [
  {
    id: 1,
    content: "Hello New World!",
    reportId: 1,
    Report: {} as ReportType,
    accountId: 1,
    Account: { fullname: "John Doe" } as AccountType,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    content:
      "All the boys and girls \nI got some true stories to tell \nYou're back outside, but they still lied \nWhoa, oh, oh, oh (yeah)",
    reportId: 2,
    Report: {} as ReportType,
    accountId: 2,
    Account: { fullname: "Alice Smith" } as AccountType,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    content: "I totally agree with the previous point.",
    reportId: 1,
    Report: {} as ReportType,
    accountId: 3,
    Account: { fullname: "Bob Johnson" } as AccountType,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    content: "Can you provide more details?",
    reportId: 3,
    Report: {} as ReportType,
    accountId: 4,
    Account: { fullname: "Emily Davis" } as AccountType,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    content: "I think we need to reconsider our approach.",
    reportId: 2,
    Report: {} as ReportType,
    accountId: 5,
    Account: { fullname: "Michael Brown" } as AccountType,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    content: "Interesting perspective! Let's discuss further.",
    reportId: 4,
    Report: {} as ReportType,
    accountId: 6,
    Account: { fullname: "Sophia Wilson" } as AccountType,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 7,
    content: "I have some concerns about this approach.",
    reportId: 3,
    Report: {} as ReportType,
    accountId: 7,
    Account: { fullname: "David Martinez" } as AccountType,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 8,
    content: "Let's set up a meeting to discuss this in depth.",
    reportId: 4,
    Report: {} as ReportType,
    accountId: 8,
    Account: { fullname: "Olivia Taylor" } as AccountType,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
